import { ProductBrand } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { formatDate } from 'src/shared/utils';
import { UserEntity } from 'src/users/entities/user.entity';

export class ProductBrandEntity implements ProductBrand {
  id: number;
  name: string;
  @Exclude()
  mediaId: number | null;

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

  get date(): string | null {
    if (!this.createdAt) {
      return null;
    }
    return formatDate(this.createdAt);
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
}
