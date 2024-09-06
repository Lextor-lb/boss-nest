import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  city: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  township: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  street: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  company: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  addressDetail: string;

  @IsOptional()
  EcommerceUserId: number;
}
