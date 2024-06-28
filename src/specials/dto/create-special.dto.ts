import { IsInt, IsNotEmpty, IsOptional, IsString} from "class-validator"

export class CreateSpecialDto {
   @IsNotEmpty()
   @IsString()
   name: string;

   @IsNotEmpty()
   @IsInt()
   promotionRate: number;

   @IsOptional()
   isArchived?: Date;

   @IsOptional()
   createdByUserId: number;

   @IsOptional()
   updatedByUserId: number;
}