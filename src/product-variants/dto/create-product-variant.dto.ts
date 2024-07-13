import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsUniqueBarcode } from 'src/shared/customValidation/barcodeValidation';
import { IsEntityExists } from 'src/shared/customValidation/validation';

export class CreateProductVariantDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(25)
  shopCode: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(25)
  productCode: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(25)
  colorCode: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(25)
  @IsUniqueBarcode()
  barcode: string;

  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @IsEntityExists('productSizing')
  productSizingId: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @IsEntityExists('product')
  productId: number;

  @IsOptional()
  //   @IsNumber()
  createdByUserId: number;

  @IsOptional()
  //   @IsNumber()
  updatedByUserId: number;

  @IsOptional()
  imageFileUrl?: string;
}
