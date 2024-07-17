import { Module } from '@nestjs/common';
import { CategoryReportService } from './category-report.service';
import { CategoryReportController } from './category-report.controller';
import { ProductCategoriesModule } from 'src/product-categories/product-categories.module';
import { PrismaService } from 'src/prisma';
import { ProductCategoriesService } from 'src/product-categories';

@Module({
  imports: [ProductCategoriesModule],
  controllers: [CategoryReportController],
  providers: [CategoryReportService, PrismaService, ProductCategoriesService],
})
export class CategoryReportModule {}
