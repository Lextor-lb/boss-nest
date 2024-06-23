import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsEntityExists } from 'customValidation/validation';

export class CreateProductFittingDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsArray()
  @IsInt({ each: true })
  @IsEntityExists('productSizings')
  productSizingIds: number[];

  @IsOptional()
  //   @IsNumber()
  createdByUserId: number;

  @IsOptional()
  //   @IsNumber()
  updatedByUserId: number;

  @IsOptional()
  isArchived?: Date;
}
