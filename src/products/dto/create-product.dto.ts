import { Gender } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsEntityExists } from 'customValidation/validation';
import { CreateProductVariantDto } from 'src/product-variants/dto/create-product-variant.dto';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  //   @IsNumber()
  createdByUserId: number;

  @IsOptional()
  //   @IsNumber()
  updatedByUserId: number;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => {
    return ['true', true, '1', 1].includes(value);
  })
  isEcommerce: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => {
    return ['true', true, '1', 1].includes(value);
  })
  isPos: boolean;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  stockPrice: number;

  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  salePrice: number;

  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @IsEntityExists('productBrand')
  productBrandId: number;

  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @IsEntityExists('productType')
  productTypeId: number;

  @IsNotEmpty()
  @IsInt()
  @IsEntityExists('productCategory', {
    message: 'Product category does not exist',
  })
  @Transform(({ value }) => parseInt(value, 10))
  productCategoryId: number;

  // @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @IsEntityExists('productFitting')
  productFittingId: number;

  @IsOptional()
  isArchived?: Date;

  @IsOptional()
  imageFilesUrl?: string[];

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  productVariants?: CreateProductVariantDto[];
}

// @IsNotEmpty()
// @IsArray()
// @ValidateNested({ each: true })
// @Type(() => ProductVariantDto)
// productVariants: ProductVariantDto[];

// class ProductVariantDto {
//   @IsNotEmpty()
//   @IsString()
//   @MinLength(1)
//   @MaxLength(25)
//   shopCode: string;

//   @IsNotEmpty()
//   @IsString()
//   @MinLength(1)
//   @MaxLength(25)
//   productCode: string;

//   @IsNotEmpty()
//   @IsString()
//   @MinLength(1)
//   @MaxLength(25)
//   colorCode: string;

//   @IsNotEmpty()
//   @IsString()
//   @MinLength(1)
//   @MaxLength(25)
//   barcode: string;

//   @IsNotEmpty()
//   @IsInt()
//   @Transform(({ value }) => parseInt(value, 10))
//   @IsEntityExists('productSizing', { message: 'Product sizing does not exist' })
//   productSizingId: number;

//   @IsOptional()
//   @IsString()
//   image?: string;
// }
