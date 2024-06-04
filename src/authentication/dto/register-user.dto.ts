import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsInt,
  MinLength,
} from 'class-validator';
import { UserRole } from '@prisma/client';

// enum UserRole {
//   ADMIN = 'admin',
//   STUFF = 'stuff',
// }

export class RegisterUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(UserRole) // Use the imported UserRole directly
  role: UserRole;

  @IsString()
  @MinLength(8)
  password: string;

  @IsInt()
  phoneNumber: number;
}
