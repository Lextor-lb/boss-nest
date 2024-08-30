import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Module } from '@nestjs/common';
import { MediaModule } from 'src/media/media.module';
import { ProductVariantsModule } from 'src/product-variants/product-variants.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [MediaModule, ProductVariantsModule, PrismaModule],
  exports: [ProductsService],
})
export class ProductsModule {}
