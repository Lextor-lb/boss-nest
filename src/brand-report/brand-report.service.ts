import { Injectable } from '@nestjs/common';
import { CreateBrandReportDto } from './dto/create-brand-report.dto';
import { UpdateBrandReportDto } from './dto/update-brand-report.dto';
import { PrismaService } from 'src/prisma';
import { ProductBrandsService } from 'src/product-brands';
import { SearchOption } from 'src/shared/types';
import { BrandReportPagination } from 'src/shared/types/brandReport';
import { Prisma } from '@prisma/client';
import { endOfMonth, endOfToday, endOfWeek, endOfYear, startOfMonth, startOfToday, startOfWeek, startOfYear } from 'date-fns';
import { BrandReportEntity } from './entities';

@Injectable()
export class BrandReportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly brandService: ProductBrandsService
  ){}

  async generateReport(options: SearchOption): Promise<BrandReportPagination> {
    const where: Prisma.voucherRecordWhereInput = {};

    // Apply date filters based on the request
    const currentDate = new Date();
    switch (options.search) {
      case 'today':
        where.createdAt = {
          gte: startOfToday(),
          lte: endOfToday(),
        };
        console.log('Applying today filter:', where.createdAt);
        break;
      case 'weekly':
        where.createdAt = {
          gte: startOfWeek(currentDate),
          lte: endOfWeek(currentDate),
        };
        console.log('Applying weekly filter:', where.createdAt);
        break;
      case 'monthly':
        where.createdAt = {
          gte: startOfMonth(currentDate),
          lte: endOfMonth(currentDate),
        };
        console.log('Applying monthly filter:', where.createdAt);
        break;
      case 'yearly':
        where.createdAt = {
          gte: startOfYear(currentDate),
          lte: endOfYear(currentDate),
        };
        console.log('Applying yearly filter:', where.createdAt);
        break;
    }

    // Execute the query
    const brands = await this.prisma.productBrand.findMany({
      include: {
        products: {
          include: {
            productVariants: {
              include: {
                voucherRecords: {
                  where,
                  select: {
                    id: true,
                    product: true,
                    createdAt: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const result = brands.map(brand => {
      const voucherRecords = brand.products.flatMap(product =>
        product.productVariants.flatMap(variant =>
          variant.voucherRecords,
        ),
      );

      const quantity = voucherRecords.length;
      const totalStockPrice = voucherRecords.reduce((sum, record) => {
        const productData = typeof record.product === 'string'
          ? JSON.parse(record.product)
          : record.product;
        return sum + productData.stockPrice;
      }, 0);
      const totalSalePrice = voucherRecords.reduce((sum, record) => {
        const productData = typeof record.product === 'string'
          ? JSON.parse(record.product)
          : record.product;
        return sum + productData.salePrice;
      }, 0);
      const profit = totalSalePrice - totalStockPrice;
      
      return new BrandReportEntity({
        id: brand.id,
        name: brand.name,
        qty: quantity,
        originalPrice: totalStockPrice,
        salePrice: totalSalePrice,
        profit,
      });
    }).filter(brand => brand.qty > 0);

    // Pagination Details
    const page = options.page || 1;
    const limit = options.limit || 10;
    const total = result.length;
    const totalPages = Math.ceil(total / limit);

    // Sort the reports based on OrderDirection
    const orderDirection = options.orderDirection || 'asc';
    const sortedReports = result.sort((a, b) => {
      if (orderDirection === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

    // Paginate the sorted results
    const paginatedReports = sortedReports.slice((page - 1) * limit, page * limit);

    return {
      data: paginatedReports,
      total,
      page,
      limit,
      totalPages,
      orderDirection,
    };
  }
}
