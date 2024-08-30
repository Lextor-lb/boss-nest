import { Module } from '@nestjs/common';
import { ProductFittingsService } from './product-fittings.service';
import { ProductFittingsController } from './product-fittings.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ProductFittingsController],
  providers: [ProductFittingsService],
  imports: [PrismaModule],
})
export class ProductFittingsModule {}
