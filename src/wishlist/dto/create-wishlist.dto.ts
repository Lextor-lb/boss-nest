import { Type } from "class-transformer";
import { IsArray, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { IsEntityExists } from "src/shared/customValidation/validation";

export class CreateWishlistDto {
    @IsNotEmpty()
    @IsString()
    wishlistId: string;

    // @IsOptional()
    // ecommerceUserId: number;

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({each: true})
    @Type(()=>WishListRecordDto)
    productVariantIds: WishListRecordDto[];
}

export class WishListRecordDto{
    @IsNotEmpty()
    @IsInt()
    salePrice: number;

    @IsNotEmpty()
    @IsInt()
    @IsEntityExists('productVariant')
    productVariantId: number;

    @IsOptional()
    @IsInt()
    createdByUserId: number;

    @IsOptional()
    @IsInt()
    updatedByUserId: number;
}
