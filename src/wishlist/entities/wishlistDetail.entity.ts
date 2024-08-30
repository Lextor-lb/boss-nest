import { WishList } from "@prisma/client";
import { Exclude } from "class-transformer";

export class WishListDetailEntity implements WishList{
    id: number;
    wishlistId: string;

    // @Exclude()
    // ecommerceUserId: number;
    
    @Exclude()
    createdAt: Date;

    @Exclude()
    updatedAt: Date;

    @Exclude()
    isArchived: Date | null;
    customerName: string;
    customerEmail: string;

    wishlistRecords: {
        id: number;
        productName: string;
        gender: string;
        colorCode: string;
        typeName: string;
        categoryName: string;
        fittingName: string;
        sizingName: string;
        pricing: number
    }[];

    @Exclude()
    createdByUserId: number;

    @Exclude()
    updatedByUserId: number;

    constructor(partial: Partial<WishListDetailEntity>){
        Object.assign(this,partial)
    }
}