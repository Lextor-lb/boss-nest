import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { IsUniqueBarcode } from 'customValidation/barcodeValidation';
import { IsEntityExists } from 'customValidation/validation';

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
  //   @IsEntityExists('productSizing', { message: 'Product sizing does not exist' })
  productId: number;

  @IsOptional()
  //   @IsNumber()
  createdByUserId: number;

  @IsOptional()
  //   @IsNumber()
  updatedByUserId: number;

  @IsOptional()
  imageFileUrl?: string;
  // imageFile?: Express.Multer.File;
}
