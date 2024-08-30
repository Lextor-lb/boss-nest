import { IsOptional, IsString } from 'class-validator';

export class UpdateProductBrandDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  createdByUserId: number;

  @IsOptional()
  updatedByUserId: number;

  @IsOptional()
  @IsString()
  imageFileUrl: string;
}
