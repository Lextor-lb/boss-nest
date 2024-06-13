import { Gender } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { IsEntityExists } from 'customValidation/validation';

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
  @IsEntityExists('productBrand', { message: 'Product brand does not exist' })
  productBrandId: number;

  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @IsEntityExists('productType', { message: 'Product type does not exist' })
  productTypeId: number;

  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @IsEntityExists('productCategory', {
    message: 'Product category does not exist',
  })
  productCategoryId: number;

  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @IsEntityExists('productFitting', {
    message: 'Product fitting does not exist',
  })
  productFittingId: number;

  @IsOptional()
  isArchived?: Date;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  productVariants: ProductVariantDto[];
}

class ProductVariantDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(25)
  shopCode: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(25)
  productCode: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(25)
  colorCode: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(25)
  barcode: string;

  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @IsEntityExists('productSizing', { message: 'Product sizing does not exist' })
  productSizingId: number;

  @IsOptional()
  @IsString()
  image?: string;
}
