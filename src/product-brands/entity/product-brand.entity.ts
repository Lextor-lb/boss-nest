import { ProductBrand } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';
import { MediaEntity } from 'src/media';
import { formatDate } from 'src/shared/utils';
import { UserEntity } from 'src/users/entities/user.entity';

export class ProductBrandEntity implements ProductBrand {
  id: number;
  name: string;
  @Exclude()
  mediaId: number | null;

  isArchived: Date | null;
  image: string | null;

  media?: MediaEntity;

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
    media,
    createdByUser,
    updatedByUser,
    ...data
  }: Partial<ProductBrandEntity & { media?: { url: string } }>) {
    Object.assign(this, data);

    // if (media) {
    //   this.image = media.url;
    // }

    if (media) {
      this.media = new MediaEntity(media);
    }

    if (createdByUser) {
      this.createdByUser = new UserEntity(createdByUser);
    }

    if (updatedByUser) {
      this.updatedByUser = new UserEntity(updatedByUser);
    }
  }
}
