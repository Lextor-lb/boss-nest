import { Product, Gender } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { MediaEntity } from 'src/media/entity/media.entity';
import { ProductBrandEntity } from 'src/product-brands/entity/product-brand.entity';
import { ProductCategoryEntity } from 'src/product-categories/entity/product-category.entity';
import { ProductFittingEntity } from 'src/product-fittings/entity/product-fitting.entity';
import { ProductTypeEntity } from 'src/product-types/entity/product-type.entity';
import { ProductVariantEntity } from 'src/product-variants/entity/product-variant.entity';
import { formatDate, formatTime } from 'src/shared/utils';
import { createEntity, createEntityArray } from 'src/shared/utils/createEntity';

export class ProductEntity implements Product {
  id: number;
  name: string;
  productCode: string;
  description: string | null;
  isEcommerce: boolean;
  isPos: boolean;
  gender: Gender;
  stockPrice: number;
  salePrice: number;
  discountPrice: number;
  productType: ProductTypeEntity;
  productBrand: ProductBrandEntity;
  productCategory: ProductCategoryEntity;
  productFitting: ProductFittingEntity;
  medias: MediaEntity[];
  isArchived: Date | null;

  @Expose()
  get benefit(): number {
    return this.salePrice - this.stockPrice;
  }

  @Expose()
  get stock(): number {
    return this.productVariants?.length;
  }

  @Expose()
  get date(): string {
    return formatDate(this.createdAt);
  }

  @Expose()
  get time(): string {
    return formatTime(this.createdAt);
  }

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
  @Exclude()
  productVariants: ProductVariantEntity[];

  constructor(partial: Partial<ProductEntity> = {}) {
    Object.assign(this, partial);
    this.initializeEntities(partial);
  }
  private initializeEntities(partial: Partial<ProductEntity>): void {
    this.productBrand = createEntity(ProductBrandEntity, partial.productBrand);
    this.productType = createEntity(ProductTypeEntity, partial.productType);
    this.productCategory = createEntity(
      ProductCategoryEntity,
      partial.productCategory,
    );
    this.productFitting = createEntity(
      ProductFittingEntity,
      partial.productFitting,
    );
    this.productVariants = createEntityArray(
      ProductVariantEntity,
      partial.productVariants,
    );
    this.medias = createEntityArray(MediaEntity, partial.medias);
  }
}


// import { ProductType } from '@prisma/client';
// import { Exclude, Expose, Transform } from 'class-transformer';
// import { ProductCategoryEntity } from 'src/product-categories/entity/product-category.entity';
// import { formatDate } from 'src/shared/utils';
// import { createEntityArray } from 'src/shared/utils/createEntity';

// export class ProductTypeEntity implements ProductType {
//   id: number;

//   name: string;

//   productCategories: ProductCategoryEntity[];
//   @Exclude()
//   createdAt: Date;
//   @Exclude()
//   updatedAt: Date;
//   @Exclude()
//   createdByUserId: number | null;
//   @Exclude()
//   updatedByUserId: number | null;

//   isArchived: Date | null;

//   @Expose()
//   @Transform(({ value }) => (value ? formatDate(new Date(value)) : undefined), {
//     toPlainOnly: true,
//   })
//   get date(): string | null {
//     if (!this.createdAt) {
//       return null;
//     }
//     return formatDate(this.createdAt);
//   }

//   constructor(partial: Partial<ProductTypeEntity> = {}) {
//     Object.assign(this, partial);
//     // this.initializeEntities(partial);
//   }
//   private initializeEntities(partial: Partial<ProductTypeEntity>): void {
//     this.productCategories = createEntityArray(
//       ProductCategoryEntity,
//       partial.productCategories,
//     );
//   }
// }
