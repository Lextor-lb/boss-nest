import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductSizingDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  //   @IsNumber()
  createdByUserId: number;

  @IsOptional()
  //   @IsNumber()
  updatedByUserId: number;

  @IsOptional()
  isArchived?: Date;
}
