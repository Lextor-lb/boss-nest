import { AgeRange, Customer, CustomerGender, Voucher } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';
import { format } from 'date-fns';
import { SpecialEntity } from 'src/specials/entities/special.entity';

export class VoucherSummary {
  id: number;
  voucherCode: string;
  qty: number;
  total: number;
  payment: string;
  time?: string;
  createdAt: Date;

  constructor(partial: Partial<VoucherSummary>) {
    Object.assign(this, partial);
    if (partial.createdAt) {
      this.time = format(new Date(partial.createdAt), 'hh:mm a');
    }
  }
}

export class CustomerEntity implements Customer {
  id: number;
  name: string;
  phoneNumber: string;
  email: string | null;
  gender: CustomerGender;
  ageRange: AgeRange;
  dateOfBirth: Date | null;
  address: string;
  remark: string;
  specialId: number;
  private _totalVoucher: number;

  @Expose()
  @Transform(({ obj }) => formatDate(obj.dateOfBirth), { toPlainOnly: true })
  fixDateOfBirth: string;

  @Expose()
  get totalVoucher(): number {
    return this.vouchers ? this.vouchers.length : this._totalVoucher;
  }

  set totalVoucher(value: number) {
    this._totalVoucher = value;
  }

  @Expose()
  get totalPrice(): number {
    return this.vouchers
      ? this.vouchers.reduce((sum, voucher) => sum + voucher.total, 0)
      : 0;
  }

  @Expose()
  specialTitle?: string;

  @Exclude()
  createdByUserId: number;

  @Exclude()
  updatedByUserId: number;

  special: SpecialEntity;
  isArchived: Date | null;

  @Exclude()
  vouchers?: Voucher[];

  @Expose()
  get vouchersSummary(): VoucherSummary[] | undefined {
    return this.vouchers?.map(
      (voucher) =>
        new VoucherSummary({
          id: voucher.id,
          voucherCode: voucher.voucherCode,
          qty: voucher.quantity,
          total: voucher.total,
          payment: voucher.paymentMethod,
          createdAt: voucher.createdAt,
        }),
    );
  }

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<CustomerEntity> = {}) {
    Object.assign(this, partial);
    // this.initializeEntities(partial);
  }
  // private initializeEntities(partial: Partial<CustomerEntity>): void {}
}

function formatDate(date: Date): string {
  if (!date) return null;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
