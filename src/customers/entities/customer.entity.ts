import { Exclude } from 'class-transformer';
import { SpecialEntity } from 'src/specials';

export class CustomerEntity {
  id: number;
  name: string;
  phoneNumber: number;
  address: string;
  remark: string;

  @Exclude()
  createdByUserId: number;

  @Exclude()
  updatedByUserId: number;

  special: SpecialEntity;
  isArchived: Date | null;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(data: Partial<CustomerEntity>) {
    Object.assign(this, data);
    if (data.special) {
      this.special = new SpecialEntity(data.special);
    }
  }
}