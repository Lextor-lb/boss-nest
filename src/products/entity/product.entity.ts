import { Product, Gender } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { MediaEntity } from 'src/media/entity/media.entity';
import { ProductBrandEntity } from 'src/product-brands/entity/product-brand.entity';
import { ProductCategoryEntity } from 'src/product-categories/entity/product-category.entity';
import { ProductFittingEntity } from 'src/product-fittings/entity/product-fitting.entity';
import { ProductTypeEntity } from 'src/product-types/entity/product-type.entity';
import { ProductVariantEntity } from 'src/product-variants/entity/product-variant.entity';
import { formatDate } from 'src/shared/utils';
import { UserEntity } from 'src/users/entities/user.entity';

export class ProductEntity implements Product {
  id: number;
  name: string;
  description: string | null;
  isEcommerce: boolean;
  isPos: boolean;
  gender: Gender;
  stockPrice: number;
  salePrice: number;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;
  @Exclude()
  createdByUserId: number;
  @Exclude()
  updatedByUserId: number;

  @Exclude()
  productBrandId: number;
  @Exclude()
  productTypeId: number;
  @Exclude()
  productCategoryId: number;
  @Exclude()
  productFittingId: number;

  productType: ProductTypeEntity;
  productBrand: ProductBrandEntity;
  productCategory: ProductCategoryEntity;
  productFitting: ProductFittingEntity;
  medias: MediaEntity[];
  productVariants: ProductVariantEntity[];

  @Expose()
  get date(): string {
    return formatDate(this.createdAt);
  }

  createdByUser?: UserEntity;
  updatedByUser?: UserEntity;
  isArchived: Date | null;

  constructor({
    createdByUser,
    updatedByUser,
    productBrand,
    productType,
    productCategory,
    productFitting,
    medias,
    productVariants,
    ...data
  }: Partial<ProductEntity>) {
    Object.assign(this, data);

    if (createdByUser) {
      this.createdByUser = new UserEntity(createdByUser);
    }

    if (updatedByUser) {
      this.updatedByUser = new UserEntity(updatedByUser);
    }

    if (productBrand) {
      this.productBrand = new ProductBrandEntity(productBrand);
    }
    if (productType) {
      this.productType = new ProductTypeEntity(productType);
    }
    if (productCategory) {
      this.productCategory = new ProductCategoryEntity(productCategory);
    }
    if (productFitting) {
      this.productFitting = new ProductFittingEntity(productFitting);
    }
    if (productVariants) {
      this.productVariants = productVariants.map(
        (productVariant) => new ProductVariantEntity(productVariant),
      );
    }
    if (medias) {
      this.medias = medias.map((media) => new MediaEntity(media));
    }
  }
}

// @Expose()
// get mediaIds(): number[] {
//   return this.medias ? this.medias.map((media) => media.id) : [];
// }
