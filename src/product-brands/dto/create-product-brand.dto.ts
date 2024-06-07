// dto/create-product-brand.dto.ts
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProductBrandDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  name: string;
}
