export class EcommerceProduct {}
import { Gender } from '@prisma/client';
import { Expose } from 'class-transformer';
import { ProductVariantEntity } from 'src/product-variants/entity/product-variant.entity';
import { createEntityArray } from 'src/shared/utils/createEntity';
import { EcommerceProductVariantEntity } from './ecommerce-productVariant.entity';
import { MediaEntity } from 'src/media/entity/media.entity';

export class EcommerceProductDetailEntity {
  id: number;
  name: string;
  description: string;
  gender: Gender;
  salePrice: number;
  discountPrice: number;
  productType: string;
  productBrand: string;
  productCategory: string;
  productFitting: string;
  mediaUrls: MediaEntity[];
  productVariants: EcommerceProductVariantEntity[];

  @Expose()
  get totalSize() {
    const totalSizes = new Set<string>();
    this.productVariants.forEach((pv) => {
      totalSizes.add(pv.productSizing);
    });
    return Array.from(totalSizes);
  }

  constructor(partial: Partial<EcommerceProductDetailEntity> = {}) {
    Object.assign(this, partial);
    this.initializeEntities(partial);
  }
  private initializeEntities(
    partial: Partial<EcommerceProductDetailEntity>,
  ): void {
    this.productVariants = createEntityArray(
      EcommerceProductVariantEntity,
      partial.productVariants,
    );
    this.mediaUrls = createEntityArray(MediaEntity, partial.mediaUrls);
  }
}
