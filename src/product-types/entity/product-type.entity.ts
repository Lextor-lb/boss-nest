import { ProductType } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { formatDate } from 'src/shared/utils';
import { UserEntity } from 'src/users/entities/user.entity';

export class ProductTypeEntity implements ProductType {
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

  get date(): string | null {
    if (!this.createdAt) {
      return null;
    }
    return formatDate(this.createdAt);
  }

  constructor({
    createdByUser = null,
    updatedByUser = null,
    ...data
  }: Partial<ProductTypeEntity>) {
    Object.assign(this, data);

    if (createdByUser) {
      this.createdByUser = new UserEntity(createdByUser);
    }

    if (updatedByUser) {
      this.updatedByUser = new UserEntity(updatedByUser);
    }
  }
}
