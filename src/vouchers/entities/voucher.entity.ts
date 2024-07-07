import { Voucher, PaymentMethod, Type as Types } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { formatDate, formatTime } from 'src/shared/utils';
import { VoucherRecordEntity } from './voucherRecord.entity';
import { CustomerEntity } from 'src/customers';
import { SpecialEntity } from 'src/specials';

export class VoucherEntity implements Voucher {
  id: number;
  voucherCode: string;
  discount: number;
  tax: number;
  type: Types;
  paymentMethod: PaymentMethod;
  quantity: number | null;
  remark: string | null;
  total: number;
  subTotal: number;
  voucherRecord: VoucherRecordEntity[];

  @Expose()
  get customerName(): string | undefined {
    return this.customer ? this.customer.name : undefined;
  }
  @Expose()
  get phone(): number | undefined {
    return this.customer ? this.customer.phoneNumber : undefined;
  }
  @Expose()
  get royaltyDiscount(): number | undefined {
    return this.special ? this.special.promotionRate : undefined;
  }

  @Expose()
  get date(): string {
    return formatDate(this.createdAt);
  }
  @Expose()
  get time(): string {
    return formatTime(this.createdAt);
  }

  @Exclude()
  customerId: number;
  @Exclude()
  customer?: CustomerEntity;
  @Exclude()
  special: SpecialEntity;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;
  @Exclude()
  createdByUserId: number | null;
  @Exclude()
  updatedByUserId: number | null;
  @Exclude()
  isArchived: Date;

  constructor({ voucherRecord, ...data }: Partial<VoucherEntity>) {
    Object.assign(this, data);
    if (voucherRecord) {
      this.voucherRecord = voucherRecord.map(
        (record) => new VoucherRecordEntity(record),
      );
    }
  }
}
