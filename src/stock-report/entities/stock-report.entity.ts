export class StockReport {}
import { Product, Gender } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';

export class StockReportEntity {
  id: number;
  name: string;
  gender: Gender;
  productType: string;
  productCategory: string;
  productFitting: string;
  productSizing: string;
  salePrice: number;
  totalStock: number;

  @Expose()
  @Transform(({ value }) => {
    const stockLevel = Number(value);
    if (stockLevel >= 5) return 'InStock';
    if (stockLevel > 0) return 'LowStock';
    return 'SoldOut';
  })
  stockLevel: string;

  constructor(partial: Partial<StockReportEntity> = {}) {
    Object.assign(this, partial);
  }
}
