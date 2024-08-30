import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from 'src/products';
import { ProductBrandsService } from 'src/product-brands';
import { SearchOption } from 'src/shared/types';
import { StockReportEntity } from './entities/stock-report.entity';
import { StockReportPagination } from 'src/shared/types/stockReport';

@Injectable()
export class StockReportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productsService: ProductsService,
    private readonly productBrandsService: ProductBrandsService,
  ) {}

  async generateReport(options: SearchOption): Promise<StockReportPagination> {
    const [allProducts, allProductBrands, paginatedProducts] =
      await Promise.all([
        this.productsService.indexAll(),
        this.productBrandsService.indexAll(),
        this.productsService.findAll(options),
      ]);

    const stockStats = this.calculateStockStats(allProducts);
    const stockPercentages = this.calculateStockPercentages(stockStats);
    const { totalBrands, totalProducts, totalProductPrice } =
      this.getTotalCounts(allProducts, allProductBrands);
    const { totalPrice, bestSellerBrands } =
      await this.calculateTotalPriceAndBestSellers();

    const analysisData = {
      totalBrands,
      totalProducts,
      totalProductPrice,
      ...stockStats,
      ...stockPercentages,
      totalPrice,
      bestSellerBrands,
    };

    const products = this.formatPaginatedProducts(paginatedProducts);

    return {
      ...analysisData,
      products,
      total: paginatedProducts.total,
      page: paginatedProducts.page,
      limit: paginatedProducts.limit,
      totalPages: paginatedProducts.totalPages,
    };
  }

  private calculateStockStats(products: any[]): {
    totalVariants: number;
    inStock: number;
    lowStock: number;
    outOfStock: number;
  } {
    return products.reduce(
      (acc, product) => {
        const variantCount = product.productVariants.length;
        acc.totalVariants += variantCount;

        if (variantCount >= 5) {
          acc.inStock += variantCount;
        } else if (variantCount > 0) {
          acc.lowStock += variantCount;
        } else {
          acc.outOfStock += 1;
        }

        return acc;
      },
      { totalVariants: 0, inStock: 0, lowStock: 0, outOfStock: 0 },
    );
  }

  private calculateStockPercentages(stockStats: {
    totalVariants: number;
    inStock: number;
    lowStock: number;
    outOfStock: number;
  }) {
    const { totalVariants, inStock, lowStock, outOfStock } = stockStats;
    return {
      inStockPercentage: this.calculatePercentage(inStock, totalVariants),
      lowStockPercentage: this.calculatePercentage(lowStock, totalVariants),
      outOfStockPercentage: this.calculatePercentage(outOfStock, totalVariants),
    };
  }

  private calculatePercentage(part: number, total: number): number {
    return total ? Math.round((part / total) * 100) : 0;
  }

  private getTotalCounts(
    allProducts: any[],
    allProductBrands: any[],
  ): { totalBrands: number; totalProducts: number; totalProductPrice: number } {
    const totalPrice = allProducts.reduce(
      (sum, product) => sum + product.salePrice,
      0,
    );

    return {
      totalBrands: allProductBrands.length,
      totalProducts: allProducts.length,
      totalProductPrice: totalPrice,
    };
  }

  private async calculateTotalPriceAndBestSellers() {
    const brands = await this.prisma.productBrand.findMany({
      select: {
        id: true,
        name: true,
        products: {
          select: {
            productVariants: {
              select: {
                voucherRecords: {
                  select: {
                    id: true,
                    product: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const brandData = brands
      .map((brand) => this.calculateBrandData(brand))
      .sort((a, b) => b.quantity - a.quantity);
    const bestSellerBrands = brandData.slice(0, 4);
    const totalPrice = brandData.reduce(
      (sum, brand) => sum + brand.totalSalePrice,
      0,
    );

    return { totalPrice, bestSellerBrands };
  }

  private calculateBrandData(brand: any): {
    id: string;
    name: string;
    quantity: number;
    totalSalePrice: number;
  } {
    const voucherRecords = brand.products.flatMap((product) =>
      product.productVariants.flatMap((variant) => variant.voucherRecords),
    );

    const quantity = voucherRecords.length;
    const totalSalePrice = voucherRecords.reduce((sum, record) => {
      let productData;

      if (typeof record.product === 'string') {
        try {
          productData = JSON.parse(record.product);
        } catch (error) {
          console.error('Failed to parse product JSON:', error);
          return sum;
        }
      } else if (
        typeof record.product === 'object' &&
        record.product !== null
      ) {
        productData = record.product;
      }

      return sum + (productData?.salePrice || 0);
    }, 0);

    return {
      id: brand.id,
      name: brand.name,
      quantity,
      totalSalePrice,
    };
  }

  private formatPaginatedProducts(paginatedProducts: any): StockReportEntity[] {
    return paginatedProducts.data.map(
      (pp) =>
        new StockReportEntity({
          id: pp.id,
          name: pp.name,
          gender: pp.gender,
          productType: pp.productType.name,
          productCategory: pp.productCategory.name,
          productFitting: pp.productFitting.name,
          salePrice: pp.salePrice,
          totalStock: pp.productVariants.length,
          stockLevel: pp.productVariants.length.toString(),
        }),
    );
  }
}
