import { Customer } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { SpecialEntity } from 'src/specials/entities/special.entity';
import { UserEntity } from 'src/users/entities/user.entity';

export class CustomerEntity {
  id: number;
  name: string;
  phoneNumber: number;
  address: string;

  @Exclude()
  createdByUserId: number;

  @Exclude()
  updatedByUserId: number;
  @Exclude()
  // special?: SpecialEntity; // Change from specialId: number to special: SpecialEntity
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;

  constructor(data: Partial<CustomerEntity>) {
    Object.assign(this, data);
    // if (data.special) {
    //   this.special = new SpecialEntity(data.special);
    // }
  }
}
