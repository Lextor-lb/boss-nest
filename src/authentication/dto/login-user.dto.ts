import { IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsString()
  name: string;

  @IsString()
  @MinLength(8)
  password: string;
}
