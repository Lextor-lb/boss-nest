//src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { EcommerceJwtStrategy } from './ecommerce-jwt.strategy';
import { EcommerceJwtAuthGuard } from './ecommerce-jwt-auth.guard';
import { ConfigModule } from '@nestjs/config';
import { FirebaseService } from 'src/firebase/firebase/firebase.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { EcommerceUsersModule } from 'src/ecommerce-users/ecommerce-users.module';

export const jwtSecret = 'zjP9h6ZI5LoSKCRj';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '7d' }, // e.g. 7d, 24h
    }),
    UsersModule,
    ConfigModule,
    EcommerceUsersModule,
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    JwtAuthGuard,
    EcommerceJwtStrategy,
    EcommerceJwtAuthGuard,
    AuthService,
    FirebaseService,
  ],
})
export class AuthModule {}
