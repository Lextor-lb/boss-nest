import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { SearchOption } from 'src/shared/types';
import { FittingReportPagination } from 'src/shared/types/fittingReport';
import { Prisma } from '@prisma/client';
import { endOfMonth, endOfToday, endOfWeek, endOfYear, startOfMonth, startOfToday, startOfWeek, startOfYear } from 'date-fns';
import { FittingReportEntity } from './entities';

@Injectable()
export class FittingReportService {
  constructor(private readonly prisma: PrismaService) {}

  async generateReport(options: SearchOption): Promise<FittingReportPagination> {
    const where: Prisma.ProductVariantWhereInput = {};

    const currentDate = new Date();
    switch (options.search) {
      case 'today':
        where.createdAt = {
          gte: startOfToday(),
          lte: endOfToday(),
        };
        break;
      case 'weekly':
        where.createdAt = {
          gte: startOfWeek(currentDate),
          lte: endOfWeek(currentDate),
        };
        break;
      case 'monthly':
        where.createdAt = {
          gte: startOfMonth(currentDate),
          lte: endOfMonth(currentDate),
        };
        break;
      case 'yearly':
        where.createdAt = {
          gte: startOfYear(currentDate),
          lte: endOfYear(currentDate),
        };
        break;
    }

    console.log('Date filter criteria:', where);

    const fittings = await this.prisma.productFitting.findMany({
      include: {
        products: {
          include: {
            productVariants: {
              where,
              select: {
                id: true,
                product: {
                  select: {
                    productFitting: true, // Include the productFitting relationship
                    stockPrice: true,
                    salePrice: true,
                  }
                },
                createdAt: true,
                productSizing: true
              }
            }
          }
        }
      }
    });

    console.log('Raw query response:', JSON.stringify(fittings, null, 2));
    
    const report = fittings.reduce((acc, record) => {
      record.products.forEach(product => {
        product.productVariants.forEach(variant => {
          const fittingName = variant.product.productFitting.name;
          const sizingName = variant.productSizing.name;
    
          if (!acc[fittingName]) {
            acc[fittingName] = {
              id: variant.product.productFitting.id,
              name: fittingName,
              totalQty: 0,
              totalOriginalPrice: 0,
              totalSalePrice: 0,
              totalProfit: 0,
              relatedSizings: {},
            };
          }
          acc[fittingName].totalQty += 1;
          acc[fittingName].totalOriginalPrice += variant.product.stockPrice;
          acc[fittingName].totalSalePrice += variant.product.salePrice;
          acc[fittingName].totalProfit += variant.product.salePrice - variant.product.stockPrice;
    
          if (!acc[fittingName].relatedSizings[sizingName]) {
            acc[fittingName].relatedSizings[sizingName] = 0;
          }
          acc[fittingName].relatedSizings[sizingName] += 1;
        });
      });
    
      return acc;
    }, {});

    console.log('Processed report:', JSON.stringify(report, null, 2));

    const result = Object.values(report).map(data => new FittingReportEntity(data)).filter(report => report.qty > 0);

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
