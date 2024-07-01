import { ProductCategory, ProductFitting } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ProductFittingEntity } from 'src/product-fittings';
import { ProductTypeEntity } from 'src/product-types';
import { formatDate } from 'src/shared/utils';
import { createEntity, createEntityArray } from 'src/shared/utils/createEntity';
import { UserEntity } from 'src/users/entities/user.entity';

export class ProductCategoryEntity implements ProductCategory {
  id: number;
  name: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
  @Exclude()
  createdByUserId: number | null;
  @Exclude()
  updatedByUserId: number | null;

  isArchived: Date | null;

  createdByUser?: UserEntity;
  updatedByUser?: UserEntity;

  productType: ProductTypeEntity;
  productFittingIds: number[];
  productFittings: ProductFitting[];

  productTypeId: number;

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

  constructor(partial: Partial<ProductCategoryEntity> = {}) {
    Object.assign(this, partial);
    this.initializeEntities(partial);
  }
  private initializeEntities(partial: Partial<ProductCategoryEntity>): void {
    this.productType = createEntity(ProductTypeEntity, partial.productType);

    this.productFittings = createEntityArray(
      ProductFittingEntity,
      partial.productFittings,
    );
  }
}
