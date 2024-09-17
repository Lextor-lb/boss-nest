import { Voucher, PaymentMethod, Type as Types, User } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { formatDate, formatTime } from 'src/shared/utils';
import { VoucherRecordEntity } from './voucherRecord.entity';
import { CustomerEntity } from 'src/customers';
import { SpecialEntity } from 'src/specials';

export class VoucherEntity implements Voucher {
  id: number;
  customerName: string | null;
  phoneNumber: string | null;
  promotionRate: number;
  voucherCode: string;
  discount: number;
  discountByValue: number;
  tax: number;
  type: Types;
  paymentMethod: PaymentMethod;
  quantity: number | null;
  remark: string | null;
  total: number;
  subTotal: number;
  voucherRecords: VoucherRecordEntity[];

  @Exclude()
  createdByUser: { name } | undefined; // Define a proper structure for `createdByUser`

  @Expose()
  get salePerson(): string | undefined {
    return this.createdByUser?.name; // Use optional chaining to access `name`
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

  constructor({ voucherRecords, ...data }: Partial<VoucherEntity>) {
    Object.assign(this, data);
    if (voucherRecords) {
      this.voucherRecords = voucherRecords.map(
        (record) => new VoucherRecordEntity(record),
      );
    }
  }
}
