import { Address } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class AddressEntity implements Address {
  id: number;
  city: string | null;
  township: string | null;
  street: string | null;
  company: string | null;
  addressDetail: string | null;
  @Exclude()
  isArchived: Date | null;

  @Exclude()
  ecommerceUserId: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<AddressEntity> = {}) {
    Object.assign(this, partial);
  }
}
