import { ProductBrand } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { UserEntity } from 'src/users/entities/user.entity';

export class ProductBrandEntity implements ProductBrand {
  id: number;
  name: string;
  @Exclude()
  mediaId: number | null;
  createdBy: number;
  updatedBy: number;
  isArchived: Date | null;
  image: string | null;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  createdByUserId: number | null;

  @Exclude()
  updatedByUserId: number | null;

  createdByUser?: UserEntity;
  updatedByUser?: UserEntity;

  @Expose()
  get date(): string {
    return this.formatDate(this.updatedAt);
  }

  constructor({
    media = null,
    createdByUser = null,
    updatedByUser = null,
    ...data
  }: Partial<ProductBrandEntity & { media?: { url: string } }>) {
    Object.assign(this, data);

    if (media) {
      this.image = media.url;
    }

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
