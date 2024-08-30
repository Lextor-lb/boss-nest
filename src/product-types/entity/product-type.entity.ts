import { ProductType } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ProductCategoryEntity } from 'src/product-categories/entity/product-category.entity';
import { formatDate } from 'src/shared/utils';

export class ProductTypeEntity implements ProductType {
  id: number;
  name: string;

  @Expose()
  @Transform(({ value }) => (value && value.length > 0 ? value : undefined), {
    toPlainOnly: true,
  })
  productCategories: ProductCategoryEntity[];
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;
  @Exclude()
  createdByUserId: number | null;
  @Exclude()
  updatedByUserId: number | null;
  isArchived: Date | null;

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

  constructor({ ...data }: Partial<ProductTypeEntity>) {
    Object.assign(this, data);
  }
}
