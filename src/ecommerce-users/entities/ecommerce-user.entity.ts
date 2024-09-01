import { Exclude } from 'class-transformer';
import { EcommerceUser, UserRole } from '@prisma/client';

export class EcommerceUserEntity implements EcommerceUser {
  id: number;
  name: string;
  phone: string | null;
  email: string;

  @Exclude()
  isArchived: Date | null;

  @Exclude()
  createdAt: Date;

  @Exclude()
  role: UserRole;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<EcommerceUserEntity> = {}) {
    Object.assign(this, partial);
  }
}
