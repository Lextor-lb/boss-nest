// dto/create-product-brand.dto.ts
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProductBrandDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  name: string;

  @IsOptional()
  createdByUserId: number;

  @IsOptional()
  updatedByUserId: number;

  @IsOptional()
  imageFileUrl?: string;
}
