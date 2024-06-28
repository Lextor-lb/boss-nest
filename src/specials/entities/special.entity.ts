import { Special } from "@prisma/client";
import { Exclude } from "class-transformer";
import { UserEntity } from "src/users/entities/user.entity";

export class SpecialEntity implements Special {
  id: number;
  name: string;
  promotionRate: number;
  isArchived: Date | null;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  createdByUserId: number | null;

  @Exclude()
  updatedByUserId: number | null;

  createdByUser?: UserEntity;
  updatedByUser?: UserEntity;

  constructor({
    createdByUser,
    updatedByUser,
    ...data
  }: Partial<SpecialEntity>) {
    Object.assign(this, data);

    if (createdByUser) {
      this.createdByUser = new UserEntity(createdByUser);
    }

    if (updatedByUser) {
      this.updatedByUser = new UserEntity(updatedByUser);
    }
  }
}