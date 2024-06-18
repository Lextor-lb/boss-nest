import { Optional } from '@nestjs/common';
import { IsString, IsNumber } from 'class-validator';

export class MediaDto {
  @IsString()
  url: string;

  @Optional()
  @IsNumber()
  productId: number;
}
