import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsEntityExists } from 'customValidation/validation';

export class CreateProductCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  //   @IsNumber()
  createdByUserId: number;

  @IsOptional()
  //   @IsNumber()
  updatedByUserId: number;

  @IsNotEmpty()
  @IsInt()
  @IsEntityExists('productType', { message: 'Product type does not exist' })
  productTypeId: number;

  @IsNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  @IsEntityExists('productFittings', {
    message: 'Some product fittings do not exist',
  })
  productFittingIds: number[];

  @IsOptional()
  isArchived?: Date;
}
