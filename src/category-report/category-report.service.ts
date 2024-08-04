import { Injectable } from '@nestjs/common';
import { CreateCategoryReportDto } from './dto/create-category-report.dto';
import { UpdateCategoryReportDto } from './dto/update-category-report.dto';
import { PrismaService } from 'src/prisma';
import { ProductCategoriesService } from 'src/product-categories';
import { SearchOption } from 'src/shared/types';
import { Prisma } from '@prisma/client';
import {
  endOfMonth,
  endOfToday,
  endOfWeek,
  endOfYear,
  parse,
  startOfMonth,
  startOfToday,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import { CategoryReportEntity } from './entities';
import { CategoryReportPagination } from 'src/shared/types/categoryReport';

@Injectable()
export class CategoryReportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoryService: ProductCategoriesService,
  ) {}

  async generateReport(
    start: string,
    end: string,
    options: SearchOption,
  ): Promise<CategoryReportPagination> {
    const where: Prisma.VoucherRecordWhereInput = {};
    const currentDate = new Date();

    if (options.search === 'custom') {
      const startDate = parse(start, 'dd-MM-yyyy', new Date());
      const endDate = parse(end, 'dd-MM-yyyy', new Date());

      where.createdAt = {
        gte: startDate,
        lt: endDate,
      };
    } else {
      // Apply date filters based on the request
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
    }

    // Execute the query
    const categories = await this.prisma.productCategory.findMany({
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

    const result = categories
      .map((category) => {
        const voucherRecords = category.products.flatMap((product) =>
          product.productVariants.flatMap((variant) => variant.voucherRecords),
        );

        const quantity = voucherRecords.length;

        const totalStockPrice = voucherRecords.reduce((sum, record) => {
          const productData =
            typeof record.product === 'string'
              ? JSON.parse(record.product)
              : record.product;
          return sum + productData.stockPrice;
        }, 0);

        const totalSalePrice = voucherRecords.reduce((sum, record) => {
          const productData =
            typeof record.product === 'string'
              ? JSON.parse(record.product)
              : record.product;
          return sum + productData.salePrice;
        }, 0);

        const profit = totalSalePrice - totalStockPrice;

        return new CategoryReportEntity({
          id: category.id,
          name: category.name,
          qty: quantity,
          originalPrice: totalStockPrice,
          salePrice: totalSalePrice,
          profit,
        });
      })
      .filter((category) => category.qty > 0);

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
    const paginatedReports = sortedReports.slice(
      (page - 1) * limit,
      page * limit,
    );

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
