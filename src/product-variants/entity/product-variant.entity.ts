import { Exclude, Expose } from 'class-transformer';
import { MediaEntity } from 'src/media/entity/media.entity';
import { ProductEntity } from 'src/products/entity/product.entity';
import { ProductSizingEntity } from 'src/product-sizings/entity/product-sizing.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { formatDate } from 'src/shared/utils';
import { ProductVariant, StatusStock } from '@prisma/client';

export class ProductVariantEntity implements ProductVariant {
  id: number;
  @Exclude()
  productId: number;
  shopCode: string;
  colorCode: string;
  barcode: string;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;
  @Exclude()
  createdByUserId: number;
  @Exclude()
  updatedByUserId: number;
  statusStock: StatusStock | null;
  @Exclude()
  productSizingId: number;
  @Exclude()
  mediaId: number | null;
  @Exclude()
  isArchived: Date | null;

  product: ProductEntity;
  productSizing: ProductSizingEntity;
  media?: MediaEntity;

  createdByUser?: UserEntity;
  updatedByUser?: UserEntity;

  @Expose()
  get date(): string {
    return formatDate(this.createdAt);
  }

  constructor({
    createdByUser,
    updatedByUser,
    product,
    productSizing,
    media,
    ...data
  }: Partial<ProductVariantEntity>) {
    Object.assign(this, data);

    if (createdByUser) {
      this.createdByUser = new UserEntity(createdByUser);
    }

    if (updatedByUser) {
      this.updatedByUser = new UserEntity(updatedByUser);
    }

    if (product) {
      this.product = new ProductEntity(product);
    }

    if (productSizing) {
      this.productSizing = new ProductSizingEntity(productSizing);
    }

    if (media) {
      this.media = new MediaEntity(media);
    }
  }
}
