import { Prisma } from "@prisma/client";
import { Exclude } from "class-transformer";

export class CouponEntity{
    id: number;
    name: string;
    couponId: string;
    discount: number;
    expiredDate: Date;
    isArchived: Date | null;

    @Exclude()
    createdAt: Date;

    @Exclude()
    updatedAt: Date;

    @Exclude()
    createdByUserId: number | null;

    @Exclude()
    updatedByUserId: number | null;

    constructor(partial: Partial<CouponEntity>){
       Object.assign(this,partial);
    }
}
