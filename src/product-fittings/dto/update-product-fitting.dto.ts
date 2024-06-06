import { IsString, IsArray, IsInt, IsOptional } from 'class-validator';

export class UpdateProductFittingDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  productSizingIds?: number[];
}
