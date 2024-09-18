// // src/auth/ecommerce-jwt.strategy.ts
// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class EcommerceJwtStrategy extends PassportStrategy(
//   Strategy,
//   'ecommerce-jwt',
// ) {
//   constructor(private readonly configService: ConfigService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: configService.get('JWT_SECRET'),
//     });
//   }

//   async validate(payload: any) {
//     return { userId: payload.userId, email: payload.email };
//   }
// }

//src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtSecret } from './auth.module';
import { PrismaService } from 'src/prisma';
import { EcommerceUsersService } from 'src/ecommerce-users/ecommerce-users.service';

@Injectable()
export class EcommerceJwtStrategy extends PassportStrategy(
  Strategy,
  'ecommerce-jwt',
) {
  constructor(
    private prisma: PrismaService,
    private ecommerceUsersService: EcommerceUsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: { email: string }) {
    try {
      const user = await this.prisma.ecommerceUser.findUnique({
        where: { email: payload.email },
      });

      const ecommerceUser = await this.prisma.ecommerceUser.findUnique({
        where: { email: payload.email },
      });

      if (!user && !ecommerceUser) {
        throw new UnauthorizedException();
      }
      if (user) {
        return user;
      }
      if (ecommerceUser) {
        return ecommerceUser;
      }
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
