import { Module } from '@nestjs/common';
import { ProductSizingsService } from './product-sizings.service';
import { ProductSizingsController } from './product-sizings.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ProductSizingsController],
  providers: [ProductSizingsService],
  imports: [PrismaModule],
})
export class ProductSizingsModule {}
