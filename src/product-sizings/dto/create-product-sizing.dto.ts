import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductSizingDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  createdByUserId: number;

  @IsOptional()
  updatedByUserId: number;

  @IsOptional()
  isArchived?: Date;
}
