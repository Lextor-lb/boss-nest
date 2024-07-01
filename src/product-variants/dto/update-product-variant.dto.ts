import { Transform } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsUniqueBarcode } from 'customValidation/barcodeValidation';
import { IsEntityExists } from 'customValidation/validation';

export class UpdateProductVariantDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(25)
  shopCode: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(25)
  productCode: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(25)
  colorCode: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(25)
  @IsUniqueBarcode()
  barcode: string;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @IsEntityExists('productSizing')
  productSizingId: number;

  // @IsOptional()
  // @IsInt()
  // @Transform(({ value }) => parseInt(value, 10))
  // //   @IsEntityExists('productSizing', { message: 'Product sizing does not exist' })
  // productId: number;

  @IsOptional()
  createdByUserId: number;

  @IsOptional()
  updatedByUserId: number;

  @IsOptional()
  imageFileUrl?: string;
}
