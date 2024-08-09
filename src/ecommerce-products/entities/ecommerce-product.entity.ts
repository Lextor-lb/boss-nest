export class EcommerceProduct {}
import { Gender } from '@prisma/client';
import { Expose } from 'class-transformer';
import { createEntityArray } from 'src/shared/utils/createEntity';
import { EcommerceProductVariantEntity } from './ecommerce-productVariant.entity';
import { MediaEntity } from 'src/media/entity/media.entity';
import { ProductCategoryEntity } from 'src/product-categories';

export class EcommerceProductEntity {
  id: number;
  name: string;
  gender: Gender;
  productCode: string;
  salePrice: number;
  discountPrice: number;
  medias: MediaEntity[];

  constructor(partial: Partial<EcommerceProductEntity> = {}) {
    Object.assign(this, partial);
  }
}
