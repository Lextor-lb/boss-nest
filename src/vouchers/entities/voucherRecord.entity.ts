import { Exclude, Expose } from 'class-transformer';
import { ProductVariantEntity } from 'src/product-variants/entity/product-variant.entity';
import { JsonValue } from '@prisma/client/runtime/library';
import { VoucherRecord } from '@prisma/client';

export class VoucherRecordEntity implements VoucherRecord {
  id: number;
  discount: number | null;
  cost: number;

  @Expose()
  get productName() {
    return this.productData.name;
  }

  @Expose()
  get gender() {
    return this.productData.gender;
  }

  @Expose()
  get productBrand() {
    return this.productData.productBrand;
  }

  @Expose()
  get productType() {
    return this.productData.productType;
  }

  @Expose()
  get productCategory() {
    return this.productData.productCategory;
  }

  @Expose()
  get productFitting() {
    return this.productData.productFitting;
  }

  @Expose()
  get productSizing() {
    return this.productData.productSizing;
  }

  @Expose()
  get salePrice() {
    return this.productData.salePrice;
  }

  @Expose()
  get stockPrice() {
    return this.productData.stockPrice;
  }

  @Exclude()
  product: JsonValue;
  @Exclude()
  isArchived: Date;
  @Exclude()
  voucherId: number;
  @Exclude()
  createdByUserId: number | null;
  @Exclude()
  updatedByUserId: number | null;
  @Exclude()
  productVariantId: number;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;

  productVariant: ProductVariantEntity;
  private get productData() {
    return typeof this.product === 'string'
      ? JSON.parse(this.product)
      : this.product;
  }

  constructor({ productVariant, ...data }: Partial<VoucherRecordEntity>) {
    Object.assign(this, data);

    if (productVariant) {
      this.productVariant = new ProductVariantEntity(productVariant);
    }
  }
}
