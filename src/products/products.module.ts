import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { MediaModule } from 'src/media/media.module';
import { ProductVariantsModule } from 'src/product-variants/product-variants.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [PrismaModule, MediaModule, ProductVariantsModule],
})
export class ProductsModule {}
