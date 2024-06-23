import { ProductCategory, ProductFitting } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ProductFittingEntity } from 'src/product-fittings';
import { ProductTypeEntity } from 'src/product-types';
import { formatDate } from 'src/shared/utils';
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

  // @Exclude()
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

  constructor({
    createdByUser,
    updatedByUser,
    productFittingIds,
    productFittings,
    productType,
    ...data
  }: Partial<ProductCategoryEntity>) {
    Object.assign(this, data);

    if (createdByUser) {
      this.createdByUser = new UserEntity(createdByUser);
    }

    if (updatedByUser) {
      this.updatedByUser = new UserEntity(updatedByUser);
    }
    if (productType) {
      this.productType = new ProductTypeEntity(productType);
    }
    if (productFittings) {
      this.productFittings = productFittings.map(
        (productFitting) => new ProductFittingEntity(productFitting),
      );
    }

    this.productFittingIds = productFittingIds;
  }
}
