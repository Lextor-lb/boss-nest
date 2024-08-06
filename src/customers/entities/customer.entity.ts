import { Gender } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { SpecialEntity } from 'src/specials';

export class CustomerEntity {
  id: number;
  name: string;
  phoneNumber: string;
  gender: Gender;
  address: string;
  remark: string;

  @Exclude()
  createdByUserId: number;

  @Exclude()
  updatedByUserId: number;

  special: SpecialEntity;
  isArchived: Date | null;
  totalVouchers: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(data: Partial<CustomerEntity>) {
    Object.assign(this, data);
    if (data.special) {
      this.special = data.special ?? null;
    }
    // if (data.special) {
    //   this.special = new SpecialEntity(data.special);
    // }
  }
}
