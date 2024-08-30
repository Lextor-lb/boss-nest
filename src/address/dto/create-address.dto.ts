import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  city: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  township: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  street: string;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  company: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  addressDetail: string;

  @IsOptional()
  EcommerceUserId: number;
}
