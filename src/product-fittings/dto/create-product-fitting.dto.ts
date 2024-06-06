import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductFittingDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsArray()
  @IsInt({ each: true })
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
