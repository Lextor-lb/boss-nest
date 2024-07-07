import { ArrayNotEmpty, IsArray, IsInt } from "class-validator";

export class RemoveManySpecialDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsInt({each: true})
    ids: number[]
}