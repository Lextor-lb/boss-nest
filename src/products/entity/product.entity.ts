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

// export class ProductEntity implements Product {
//   id: number;
//   name: string;
//   description: string | null;
//   isEcommerce: boolean;
//   isPos: boolean;
//   gender: Gender;
//   stockPrice: number;
//   salePrice: number;

//   @Exclude()
//   createdAt: Date;

//   @Exclude()
//   updatedAt: Date;

//   @Exclude()
//   createdByUserId: number;

//   @Exclude()
//   updatedByUserId: number;

//   @Exclude()
//   productBrandId: number;

//   @Exclude()
//   productTypeId: number;

//   @Exclude()
//   productCategoryId: number;

//   @Exclude()
//   productFittingId: number;

//   productType: ProductTypeEntity;
//   productBrand: ProductBrandEntity;
//   productCategory: ProductCategoryEntity;
//   productFitting: ProductFittingEntity;
//   medias: MediaEntity[];
//   productVariants: ProductVariantEntity[];

//   @Expose()
//   get date(): string {
//     return formatDate(this.createdAt);
//   }

//   createdByUser?: UserEntity;
//   updatedByUser?: UserEntity;
//   isArchived: Date | null;

//   constructor(partial: Partial<ProductEntity>) {
//     Object.assign(this, partial);

//     this.createdByUser = partial.createdByUser ? new UserEntity(partial.createdByUser) : undefined;
//     this.updatedByUser = partial.updatedByUser ? new UserEntity(partial.updatedByUser) : undefined;
//     this.productBrand = partial.productBrand ? new ProductBrandEntity(partial.productBrand) : undefined;
//     this.productType = partial.productType ? new ProductTypeEntity(partial.productType) : undefined;
//     this.productCategory = partial.productCategory ? new ProductCategoryEntity(partial.productCategory) : undefined;
//     this.productFitting = partial.productFitting ? new ProductFittingEntity(partial.productFitting) : undefined;
//     this.productVariants = partial.productVariants ? partial.productVariants.map(variant => new ProductVariantEntity(variant)) : [];
//     this.medias = partial.medias ? partial.medias.map(media => new MediaEntity(media)) : [];
//   }
// }
///
// export class ProductEntity implements Product {
//   id: number;
//   name: string;
//   description: string | null;
//   isEcommerce: boolean;
//   isPos: boolean;
//   gender: Gender;
//   stockPrice: number;
//   salePrice: number;

//   @Exclude()
//   createdAt: Date;

//   @Exclude()
//   updatedAt: Date;

//   @Exclude()
//   createdByUserId: number;

//   @Exclude()
//   updatedByUserId: number;

//   @Exclude()
//   productBrandId: number;

//   @Exclude()
//   productTypeId: number;

//   @Exclude()
//   productCategoryId: number;

//   @Exclude()
//   productFittingId: number;

//   productType: ProductTypeEntity;
//   productBrand: ProductBrandEntity;
//   productCategory: ProductCategoryEntity;
//   productFitting: ProductFittingEntity;
//   medias: MediaEntity[];
//   productVariants: ProductVariantEntity[];

//   @Expose()
//   get date(): string {
//     return formatDate(this.createdAt);
//   }

//   createdByUser?: UserEntity;
//   updatedByUser?: UserEntity;
//   isArchived: Date | null;

//   constructor(partial: Partial<ProductEntity> = {}) {
//     Object.assign(this, partial);
//     this.initializeEntities(partial);
//   }

//   private initializeEntities(partial: Partial<ProductEntity>): void {
//     this.createdByUser = this.createEntity(UserEntity, partial.createdByUser);
//     this.updatedByUser = this.createEntity(UserEntity, partial.updatedByUser);
//     this.productBrand = this.createEntity(ProductBrandEntity, partial.productBrand);
//     this.productType = this.createEntity(ProductTypeEntity, partial.productType);
//     this.productCategory = this.createEntity(ProductCategoryEntity, partial.productCategory);
//     this.productFitting = this.createEntity(ProductFittingEntity, partial.productFitting);
//     this.productVariants = this.createEntityArray(ProductVariantEntity, partial.productVariants);
//     this.medias = this.createEntityArray(MediaEntity, partial.medias);
//   }

//   private createEntity<T>(Entity: new (partial: Partial<T>) => T, partial?: Partial<T>): T | undefined {
//     return partial ? new Entity(partial) : undefined;
//   }

//   private createEntityArray<T>(Entity: new (partial: Partial<T>) => T, partialArray?: Partial<T>[]): T[] {
//     return partialArray ? partialArray.map(partial => new Entity(partial)) : [];
//   }
// }