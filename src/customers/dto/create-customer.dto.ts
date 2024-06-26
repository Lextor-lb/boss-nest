import { isEmpty, isInt, isPhoneNumber, isString } from 'class-validator';

export class CreateCustomerDto {
  @isEmpty()
  @isString()
  name: string;

  @isEmpty()
  @isPhoneNumber()
  phoneNumber: number;

  @isEmpty()
  @isString()
  address: string;

  @isEmpty()
  @isInt()
  specialId: number;

  @IsOptional()
  createdByUserId: number;

  @IsOptional()
  updatedByUserId: number;
}
