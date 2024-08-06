import { WishList } from "@prisma/client";
import { Exclude } from "class-transformer";

export class WishlistEntity implements WishList {
    id: number;
    wishlistId: string;

    @Exclude()
    ecommerceUserId: number;

    @Exclude()
    createdAt: Date;

    @Exclude()
    updatedAt: Date;

    @Exclude()
    isArchived: Date | null;
 
    @Exclude()
    createdByUserId: number;

    @Exclude()
    updatedByUserId: number;
    customerName: string;
    customerEmail: string;

    constructor(partial: Partial<WishlistEntity>){
        Object.assign(this,partial);
    }
}
