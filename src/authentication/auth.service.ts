import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from 'src/users/users.model';
import { PrismaClient } from '@prisma/client';

export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(loginDto: LoginUserDto): Promise<any> {
    const prisma = new PrismaClient();

    const { name, password } = loginDto;
    const user = await prisma.user.findFirst({
      where: { name },
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const validatedPassword = await bcrypt.compare(password, user.password);
    if (!validatedPassword) {
      throw new NotFoundException('password not match');
    }
    return {
      token: this.jwtService.sign({ name }),
    };
  }

  async register(createDto: RegisterUserDto): Promise<any> {
    const createUser = new User();
    createUser.name = createDto.name;
    createUser.email = createDto.email;
    createUser.password = await bcrypt.hash(createDto.password, 10);
    createUser.phoneNumber = createDto.phoneNumber;
    const user = await this.usersService.create(createUser);
    return {
      token: this.jwtService.sign({ name: user.name }),
    };
  }
}
