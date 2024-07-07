import { Module } from '@nestjs/common';
import { ProductBrandsService } from './product-brands.service';
import { ProductBrandsController } from './product-brands.controller';
import { ConfigModule } from '@nestjs/config';
import { MediaModule } from 'src/media/media.module';

@Module({
  controllers: [ProductBrandsController],
  providers: [ProductBrandsService],
  imports: [ConfigModule, MediaModule],
  exports: [ProductBrandsService],
})
export class ProductBrandsModule {}
