import { Module } from '@nestjs/common';
import { ProductCategoriesController } from './product-categories.controller';
import { ProductCategoriesService } from '.';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ProductCategoriesController],
  providers: [ProductCategoriesService],
  imports: [PrismaModule],
})
export class ProductCategoriesModule {}
