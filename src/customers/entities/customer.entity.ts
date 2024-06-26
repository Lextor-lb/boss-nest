import { Exclude } from 'class-transformer';
import { Special } from 'src/specials/entities/special.entity';
import { UserEntity } from 'src/users/entities/user.entity';

export class CustomerEntity implements Customer{
  id: number;
  name: string;
  phoneNumber: number;
  address: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  createdByUserId: number | null;

  @Exclude()
  updatedByUserId: number | null;

  specialId?: Special;
  createdByUser?: UserEntity;
  updatedByUser?: UserEntity;

  constructor({
    specialId,
    createdByUser,
    updatedByUser,
    ...data
  }: Partial<CustomerEntity>) {
    Object.assign(this, data);

    if (specialId) {
      this.specialId = new Special(specialId);
    }

    if (createdByUser) {
      this.createdByUser = new UserEntity(createdByUser);
    }

    if (updatedByUser) {
      this.updatedByUser = new UserEntity(updatedByUser);
    }
  }
}