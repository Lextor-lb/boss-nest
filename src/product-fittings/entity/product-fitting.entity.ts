import { ProductFitting, ProductSizing } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ProductSizingEntity } from 'src/product-sizings';
import { formatDate } from 'src/shared/utils';
import { UserEntity } from 'src/users/entities/user.entity';

export class ProductFittingEntity implements ProductFitting {
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
  @Transform(({ value }) => (value && value.length > 0 ? value : undefined), {
    toPlainOnly: true,
  })
  productSizings: ProductSizing[];

  @Transform(({ value }) => (value && value.length > 0 ? value : undefined), {
    toPlainOnly: true,
  })
  productSizingIds?: number[];

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
    productSizingIds,
    productSizings,
    ...data
  }: Partial<ProductFittingEntity>) {
    Object.assign(this, data);

    if (createdByUser) {
      this.createdByUser = new UserEntity(createdByUser);
    }

    if (updatedByUser) {
      this.updatedByUser = new UserEntity(updatedByUser);
    }

    if (productSizings) {
      this.productSizings = productSizings.map(
        (productSizing) => new ProductSizingEntity(productSizing),
      );
    }

    this.productSizingIds = productSizingIds;
  }
}
