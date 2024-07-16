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
import { IsEntityExists } from 'src/shared/customValidation/validation';
import { CreateProductVariantDto } from 'src/product-variants/dto/create-product-variant.dto';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  createdByUserId: number;

  @IsOptional()
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
  discountPrice: number;

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
  @IsEntityExists('productCategory')
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
