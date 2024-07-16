import { Gender } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsEntityExists } from 'src/shared/customValidation/validation';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  createdByUserId: number;

  @IsOptional()
  updatedByUserId: number;

  @IsOptional()
  description: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    return ['true', true, '1', 1].includes(value);
  })
  isEcommerce: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    return ['true', true, '1', 1].includes(value);
  })
  isPos: boolean;

  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  stockPrice: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  salePrice: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  discountPrice: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @IsEntityExists('productBrand')
  productBrandId: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @IsEntityExists('productType')
  productTypeId: number;

  @IsOptional()
  @IsInt()
  @IsEntityExists('productCategory', {
    message: 'Product category does not exist',
  })
  @Transform(({ value }) => parseInt(value, 10))
  productCategoryId: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @IsEntityExists('productFitting')
  productFittingId: number;

  @IsOptional()
  isArchived?: Date;

  @IsOptional()
  imageFilesUrl?: string[];
}
