import { ProductSizing } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { UserEntity } from 'src/users/entities/user.entity';

export class ProductSizingEntity implements ProductSizing {
  id: number;

  name: string;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;

  createdByUserId: number | null;

  updatedByUserId: number | null;

  isArchived: Date | null;

  createdByUser?: UserEntity;

  updatedByUser?: UserEntity;

  @Expose()
  get date(): string {
    return this.formatDate(this.updatedAt);
  }

  constructor({
    createdByUser = null,
    updatedByUser = null,
    ...data
  }: Partial<ProductSizingEntity>) {
    Object.assign(this, data);

    if (createdByUser) {
      this.createdByUser = new UserEntity(createdByUser);
    }

    if (updatedByUser) {
      this.updatedByUser = new UserEntity(updatedByUser);
    }
  }
  private formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };
    return date.toLocaleDateString('en-US', options).replace(/,/g, '');
  }
}
