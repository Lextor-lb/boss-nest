import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsEntityExists } from 'src/shared/customValidation/validation';
import { IsUniqueOrderId } from 'src/shared/customValidation/barcodeValidation';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  @IsUniqueOrderId()
  orderCode: string;

  @IsOptional()
  @IsString()
  couponName: string;

  @IsNotEmpty()
  @IsInt()
  @IsEntityExists('address')
  addressId: number;

  // @IsInt()
  @IsOptional()
  ecommerceUserId: number;

  @IsOptional()
  cancelReason: string;
  @IsOptional()
  remark: string;

  @IsOptional()
  @IsInt()
  discount: number;

  @IsNotEmpty()
  @IsInt()
  subTotal: number;

  @IsNotEmpty()
  @IsInt()
  total: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderRecordDto)
  orderRecords: OrderRecordDto[];
}

export class OrderRecordDto {
  @IsNotEmpty()
  @IsInt()
  salePrice: number;

  @IsNotEmpty()
  @IsInt()
  @IsEntityExists('productVariant')
  productVariantId: number;

  @IsOptional()
  @IsInt()
  createdByUserId: number;

  @IsOptional()
  @IsInt()
  updatedByUserId: number;
}
