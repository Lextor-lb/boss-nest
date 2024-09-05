import { IsOptional } from 'class-validator';
import { OrderStatus } from '@prisma/client';
import { IsUniqueVoucherCode } from 'src/shared/customValidation/barcodeValidation';

export class UpdateOrderDto {
  @IsOptional()
  orderStatus: OrderStatus;
  @IsOptional()
  @IsUniqueVoucherCode()
  voucherCode: string;
  @IsOptional()
  createdByUserId: number;
  @IsOptional()
  cancelReason: string;

  @IsOptional()
  updatedByUserId: number;
}
