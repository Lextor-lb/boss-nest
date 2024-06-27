import {
  IsEmpty,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateCustomerDto {
  @IsEmpty()
  @IsString()
  name: string;

  @IsEmpty()
  @IsPhoneNumber()
  phoneNumber: number;

  @IsEmpty()
  @IsString()
  address: string;

  @IsEmpty()
  @IsInt()
  specialId: number;

  @IsOptional()
  createdByUserId: number;

  @IsOptional()
  updatedByUserId: number;
}
