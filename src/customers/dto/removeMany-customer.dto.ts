import { ArrayNotEmpty, IsArray, IsInt } from "class-validator";

export class RemoveManyCustomerDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsInt({each: true})
    ids: number[]
}