import { AgeRange, CustomerGender, Gender } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsUniquePhoneNumber } from 'src/shared/customValidation/barcodeValidation';

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsUniquePhoneNumber()
  phoneNumber: string;

  @IsOptional()
  email: string;

  @IsNotEmpty()
  @IsEnum(AgeRange)
  ageRange: AgeRange;

  @IsNotEmpty()
  @IsEnum(CustomerGender)
  gender: CustomerGender;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsInt()
  specialId?: number;

  @IsOptional()
  @IsString()
  remark: string;

  @IsOptional()
  createdByUserId: number;

  @IsOptional()
  updatedByUserId: number;
}
