import { Exclude } from 'class-transformer';
import { EcommerceUser } from '@prisma/client';

export class EcommerceUserEntity implements EcommerceUser {
  id: number;
  name: string;
  phone: string | null;
  email: string;
  city: string | null;
  township: string | null;
  street: string | null;
  company: string | null;
  addressDetail: string | null;
  @Exclude()
  isArchived: Date | null;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<EcommerceUserEntity> = {}) {
    Object.assign(this, partial);
  }
}
