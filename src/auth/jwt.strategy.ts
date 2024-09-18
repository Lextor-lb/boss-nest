//src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtSecret } from './auth.module';
import { UsersService } from 'src/users/users.service';
import { EcommerceUsersService } from 'src/ecommerce-users/ecommerce-users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private usersService: UsersService,
    private ecommerceUsersService: EcommerceUsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: { userId: number }) {
    try {
      const user = await this.usersService.findOne(payload.userId);

      const ecommerceUser = await this.ecommerceUsersService.findOne(
        payload.userId,
      );

      if (!user) {
        throw new UnauthorizedException();
      }

      if (!user) {
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
