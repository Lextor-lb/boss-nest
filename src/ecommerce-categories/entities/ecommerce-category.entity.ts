import { EcommerceCategory } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';
import { MediaEntity } from 'src/media';
import { ProductCategoryEntity } from 'src/product-categories';
import { formatDate } from 'src/shared/utils';
import { createEntity } from 'src/shared/utils/createEntity';

export class EcommerceCategoryEntity implements EcommerceCategory {
  id: number;
  name: string;
  media: MediaEntity;
  productCategory: ProductCategoryEntity;

  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;
  @Exclude()
  mediaId: number;
  @Exclude()
  isArchived: Date;
  @Exclude()
  createdByUserId: number;
  @Exclude()
  productCategoryId: number;
  @Exclude()
  updatedByUserId: number;
  @Expose()
  @Transform(({ value }) => (value ? formatDate(new Date(value)) : undefined), {
    toPlainOnly: true,
  })
  get date(): string | null {
    if (!this.createdAt) {
      return null;
    }
    return formatDate(this.createdAt);
  }
  constructor(partial: Partial<EcommerceCategoryEntity> = {}) {
    Object.assign(this, partial);
    this.initializeEntities(partial);
  }
  private initializeEntities(partial: Partial<EcommerceCategoryEntity>): void {
    this.productCategory = createEntity(
      ProductCategoryEntity,
      partial.productCategory,
    );

    this.media = createEntity(MediaEntity, partial.media);
  }
}
