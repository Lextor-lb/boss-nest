import { AgeRange, CustomerGender, Gender } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  phoneNumber: string;

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
