import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductTypeDto {
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
