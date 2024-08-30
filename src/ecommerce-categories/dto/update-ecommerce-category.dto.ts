import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { IsEntityExists } from 'src/shared/customValidation/validation';

export class UpdateEcommerceCategoryDto {
  @IsOptional()
  @IsString()
  @MaxLength(30)
  name: string;

  @IsNotEmpty()
  @IsInt()
  @IsEntityExists('productCategory')
  @Transform(({ value }) => parseInt(value, 10))
  productCategoryId: number;

  @IsOptional()
  createdByUserId: number;

  @IsOptional()
  updatedByUserId: number;

  @IsOptional()
  @IsString()
  imageFileUrl: string;
}
