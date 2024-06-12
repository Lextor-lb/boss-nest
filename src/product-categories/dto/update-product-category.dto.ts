import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

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
  productTypeId: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  productFittingIds: number[];

  @IsOptional()
  isArchived?: Date;
}
