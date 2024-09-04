import { Module } from '@nestjs/common';
import { EcommerceUsersService } from './ecommerce-users.service';
import { EcommerceUsersController } from './ecommerce-users.controller';

@Module({
  controllers: [EcommerceUsersController],
  providers: [EcommerceUsersService],
  exports: [EcommerceUsersService],
})
export class EcommerceUsersModule {}
