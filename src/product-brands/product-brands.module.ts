import { Module } from '@nestjs/common';
import { ProductBrandsService } from './product-brands.service';
import { ProductBrandsController } from './product-brands.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [ProductBrandsController],
  providers: [ProductBrandsService],
  imports: [ConfigModule],
})
export class ProductBrandsModule {}
