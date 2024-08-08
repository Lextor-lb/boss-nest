import { AgeRange, Customer, CustomerGender, Gender, Voucher } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { SpecialEntity } from 'src/specials/entities/special.entity';

interface CustomerEntityProps {
  name?: string;
  phoneNumber?: string;
  customer: Customer;
  special?: SpecialEntity;
  totalVoucher?: number;
  vouchers?: Voucher[];
}

export class CustomerEntity {
  id: number;
  name: string;
  phoneNumber: string;
  gender: CustomerGender;
  ageRange: AgeRange;
  dateOfBirth: Date | null;
  address: string;
  remark: string;
  specialId: number;

  @Exclude()
  createdByUserId: number;

  @Exclude()
  updatedByUserId: number;

  special: SpecialEntity;
  isArchived: Date | null;
  vouchers?: Voucher[];
  totalVoucher?: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor({ customer, special, totalVoucher, vouchers }: CustomerEntityProps) {
    this.id = customer.id;
    this.name = customer.name;
    this.phoneNumber = customer.phoneNumber;
    this.gender = customer.gender;
    this.ageRange = customer.ageRange;
    this.dateOfBirth = customer.dateOfBirth;
    this.address = customer.address;
    this.remark = customer.remark;
    this.createdByUserId = customer.createdByUserId;
    this.updatedByUserId = customer.updatedByUserId;
    this.createdAt = customer.createdAt;
    this.updatedAt = customer.updatedAt;
    this.special = special;
    this.specialId = customer.specialId;
    this.isArchived = customer.isArchived;
    this.totalVoucher = totalVoucher;
    this.vouchers = vouchers;
  }
}