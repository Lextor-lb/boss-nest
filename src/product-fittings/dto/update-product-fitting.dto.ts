import { IsString, IsArray, IsInt, IsOptional } from 'class-validator';
import { IsEntityExists } from 'src/shared/customValidation/validation';

export class UpdateProductFittingDto {
  @IsOptional()
  @IsString()
  id?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  updatedByUserId: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @IsEntityExists('productSizings')
  productSizingIds?: number[];
}
