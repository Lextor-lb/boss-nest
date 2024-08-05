import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCouponDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    couponId: string;

    @IsNotEmpty()
    @IsNumber()
    discount: number;

    @IsNotEmpty()
    expiredDate: Date;

    @IsOptional()
    isArchived: Date | null;

    @IsOptional()
    createdByUserId: number | null;

    @IsOptional()
    updatedByUserId: number | null;
}
