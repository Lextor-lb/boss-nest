import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';
import { IsEntityExists } from 'customValidation/validation';

export class UpdateProductCategoryDto {
  @IsOptional()
  @IsString()
  name: string;

  //   @IsNumber()
  @IsOptional()
  createdByUserId: number;

  @IsOptional()
  //   @IsNumber()
  updatedByUserId: number;

  @IsOptional()
  @IsInt()
  @IsEntityExists('productType')
  productTypeId: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @IsEntityExists('productFittings')
  productFittingIds: number[];

  @IsOptional()
  isArchived?: Date;
}
