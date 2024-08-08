import { AgeRange, Customer, CustomerGender, Voucher } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { SpecialEntity } from 'src/specials/entities/special.entity';

// interface CustomerEntityProps {
//   name?: string;
//   phoneNumber?: string;
//   customer: CustomerEntity;
//   special?: SpecialEntity;
//   totalVoucher?: number;
//   vouchers?: Voucher[];
// }

export class CustomerEntity implements Customer {
  id: number;
  name: string;
  phoneNumber: string;
  gender: CustomerGender;
  ageRange: AgeRange;
  dateOfBirth: Date | null;
  address: string;
  remark: string;
  specialId: number;
  private _totalVoucher: number;

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
  @Exclude()
  createdByUserId: number;

  @Exclude()
  updatedByUserId: number;

  special: SpecialEntity;
  isArchived: Date | null;
  vouchers?: Voucher[];

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
