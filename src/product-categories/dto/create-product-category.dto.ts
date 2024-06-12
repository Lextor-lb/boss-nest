import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

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
  productTypeId: number;

  @IsNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  productFittingIds: number[];

  @IsOptional()
  isArchived?: Date;
}
