import { Module } from '@nestjs/common';
import { ProductBrandsService } from './product-brands.service';
import { ProductBrandsController } from './product-brands.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [ProductBrandsController],
  providers: [ProductBrandsService],
  imports: [PrismaModule, ConfigModule],
})
export class ProductBrandsModule {}
