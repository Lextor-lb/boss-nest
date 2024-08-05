import { ArrayNotEmpty, IsArray, IsInt } from "class-validator";

export class RemoveManyCouponDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsInt({each: true})
    ids: number[]
}