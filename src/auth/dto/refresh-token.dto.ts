import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RefreshTokenDto {
  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
