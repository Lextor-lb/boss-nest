import { Type } from "class-transformer";
import { IsArray, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { IsUniqueOrderId } from "src/shared/customValidation/barcodeValidation";
import { IsEntityExists } from "src/shared/customValidation/validation";

export class CreateWishlistDto {
    @IsOptional()
    ecommerceUserId: number;
  
    @IsNotEmpty()
    @IsInt()
    @IsEntityExists('product')
    productId: number;
  
    @IsNotEmpty()
    @IsInt()
    salePrice: number;
  
    @IsOptional()
    @IsInt()
    createdByUserId: number;
  
    @IsOptional()
    @IsInt()
    updatedByUserId: number;
  }
