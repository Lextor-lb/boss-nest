import { Module } from '@nestjs/common';
import { ProductVariantsService } from './product-variants.service';
import { ProductVariantsController } from './product-variants.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MediaModule } from 'src/media/media.module';

@Module({
  controllers: [ProductVariantsController],
  providers: [ProductVariantsService],
  imports: [PrismaModule, MediaModule],
  exports: [ProductVariantsService],
})
export class ProductVariantsModule {}
