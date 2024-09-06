import { IsOptional, IsString, IsInt, IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateSliderDto {
  @IsOptional()
  @IsString()
  mobileImage?: string | null;

  @IsOptional()
  @IsString()
  desktopImage?: string | null;

  @IsOptional()
  @IsNotEmpty()  // Ensures that if sorting is provided, it must not be empty
  @IsString()
  sorting?: string | null;
}
