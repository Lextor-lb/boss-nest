import { WishListRecord } from "@prisma/client";
import { WishlistEntity } from "./wishlist.entity";
import { Exclude } from "class-transformer";

export class wishlistRecordEntity implements WishListRecord{
    id: number;
    productId: number;
    salePrice: number;
    createdAt: Date;
    updatedAt: Date;
    wishlistId: number;
    isArchived: Date | null;

    wishlist: WishlistEntity;

    @Exclude()
    createdByUserId: number;

    @Exclude()
    updatedByUserId: number;

    constructor(partial: Partial<wishlistRecordEntity>) {
        Object.assign(this,partial);
    }
}