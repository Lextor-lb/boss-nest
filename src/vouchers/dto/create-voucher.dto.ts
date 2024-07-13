import { PaymentMethod, Type as Types } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsEntityExists } from 'src/shared/customValidation/validation';
import { IsUniqueVoucherCode } from 'src/shared/customValidation/barcodeValidation';

export class CreateVoucherDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  @IsUniqueVoucherCode()
  voucherCode: string;

  @IsOptional()
  @Max(2)
  @IsInt()
  discount: number;

  @IsOptional()
  @Max(2)
  @IsInt()
  tax: number;

  @IsNotEmpty()
  @IsEnum(Types)
  type: Types;

  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsOptional()
  @IsInt()
  quantity: number;

  @IsOptional()
  @IsString()
  remark: string;

  @IsNotEmpty()
  total: number;
  @IsNotEmpty()
  subTotal: number;

  @IsOptional()
  createdByUserId: number;

  @IsOptional()
  updatedByUserId: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => voucherRecordDto)
  voucherRecords: voucherRecordDto[];
}

export class voucherRecordDto {
  @IsOptional()
  @Max(2)
  @IsInt()
  discount: number;

  @IsNotEmpty()
  @IsInt()
  salePrice: number;

  @IsNotEmpty()
  @IsInt()
  @IsEntityExists('productVariant')
  productVariantId: number;

  @IsOptional()
  createdByUserId: number;

  @IsOptional()
  updatedByUserId: number;
}
