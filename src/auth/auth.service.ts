// src/auth/auth.service.ts
import { AuthEntity } from './entity/auth.entity';
import { PrismaService } from './../prisma/prisma.service';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserEntity } from 'src/users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    const token = uuidv4();

    const refreshToken = this.jwtService.sign(
      { id: user.id, name: user.name, email: user.email, tokenId: token },
      { expiresIn: '9999 years' },
    );

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return {
      status: true,
      user: new UserEntity({ id: user.id, name: user.name, email: user.email }),
      accessToken: this.jwtService.sign({ userId: user.id }),
      refreshToken: refreshToken,
    };
  }
  // throw new NotFoundException(`No user found for email: ${email}`);

  async ecommerceLogin(name: string, email: string) {
    try {
      let user = await this.prisma.ecommerceUser.findUnique({
        where: { email },
      });
      if (!user) {
        user = await this.prisma.ecommerceUser.create({
          data: { name, email },
        });
      }

      const token = uuidv4();
      const refreshToken = this.jwtService.sign(
        { id: user.id, name: user.name, email: user.email, tokenId: token },
        { expiresIn: '9999 years' },
      );

      return {
        status: true,
        user: new UserEntity({
          id: user.id,
          name: user.name,
          email: user.email,
        }),
        accessToken: this.jwtService.sign({
          userId: user.id,
          email: user.email,
        }), // Include email in the payload
        refreshToken: refreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async refresh(refreshToken: string): Promise<AuthEntity> {
    const token = uuidv4();
    const { id, name, email } = this.jwtService.verify(refreshToken);
    const newRefreshToken = this.jwtService.sign(
      { id: id, name: name, email: email, tokenId: token },
      { expiresIn: '9999 years' },
    );

    return {
      status: true,
      user: new UserEntity({ id: id, name: name, email: email }),
      accessToken: this.jwtService.sign({ userId: id }),
      refreshToken: newRefreshToken,
    };
  }
}
