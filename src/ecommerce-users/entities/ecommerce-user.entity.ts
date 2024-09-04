import { Exclude, Expose, Transform } from 'class-transformer';
import { EcommerceUser, UserRole } from '@prisma/client';
import { formatDate } from 'src/shared/utils';

export class EcommerceUserEntity implements EcommerceUser {
  id: number;
  name: string;
  phone: string | null;
  email: string;
  @Exclude()
  dateOfBirth: Date;
  @Expose()
  get birthday(): string {
    return formatDate(this.dateOfBirth);
  }

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
