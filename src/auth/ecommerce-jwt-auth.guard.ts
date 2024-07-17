// // src/auth/ecommerce-jwt-auth.guard.ts
// import {
//   Injectable,
//   ExecutionContext,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class EcommerceJwtAuthGuard extends AuthGuard('ecommerce-jwt') {
//   constructor(private readonly jwtService: JwtService) {
//     super();
//   }

//   async canActivate(context: ExecutionContext) {
//     const request = context.switchToHttp().getRequest();
//     const { authorization } = request.headers;

//     if (!authorization) {
//       throw new UnauthorizedException('No authorization token found');
//     }

//     const token = authorization.split(' ')[1];
//     try {
//       const decoded = this.jwtService.verify(token);
//       request.user = decoded;
//       return true;
//     } catch (error) {
//       throw new UnauthorizedException('Invalid token');
//     }
//   }
// }
//src/auth/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class EcommerceJwtAuthGuard extends AuthGuard('ecommerce-jwt') {}
