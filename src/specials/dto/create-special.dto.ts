import { IsOptional, isInt, isNotEmpty} from "class-validator"

export class CreateSpecialDto {
   @isNotEmpty()
   @isInt()
   promotionRate: number;

   @IsOptional()
   isArchieved?: Date;

   @IsOptional()
   createdByUserId: number;

   @IsOptional()
   updatedByUserId: number;
}