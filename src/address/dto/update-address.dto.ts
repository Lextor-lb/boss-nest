import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateAddressDto {
  @IsOptional()
  @IsString()
  @MaxLength(15)
  city: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  township: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  street: string;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  company: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  addressDetail: string;
}
