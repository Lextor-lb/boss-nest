import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateAddressDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  township: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  street: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  company: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  addressDetail: string;
}
