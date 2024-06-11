import { IsOptional, IsString } from 'class-validator';

export class UpdateProductBrandDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  image?: string;
}
