import { Module } from '@nestjs/common';
import { ProductBrandsService } from './product-brands.service';
import { ProductBrandsController } from './product-brands.controller';
import { ConfigModule } from '@nestjs/config';
import { MediaModule } from 'src/media/media.module';
import { MinioModule } from 'src/minio/minio.module';

@Module({
  controllers: [ProductBrandsController],
  providers: [ProductBrandsService],
  imports: [ConfigModule, MediaModule, MinioModule],
  exports: [ProductBrandsService],
})
export class ProductBrandsModule {}
