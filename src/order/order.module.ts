import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { VouchersModule } from 'src/vouchers/vouchers.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [VouchersModule],
})
export class OrderModule {}
