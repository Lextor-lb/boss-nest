import { Gender } from '@prisma/client';

export class BarcodeEntity {
  id: number;
  barcode: string;
  productName: string;
  gender: Gender;
  discountPrice: number;
  productBrand: string;
  productType: string;
  productCategory: string;
  productFitting: string;
  productSizing: string;
  price: number;

  constructor(partial: Partial<BarcodeEntity> = {}) {
    Object.assign(this, partial);
  }
}
