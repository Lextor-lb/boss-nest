import { Module } from '@nestjs/common';
import { StockReportService } from './stock-report.service';
import { StockReportController } from './stock-report.controller';
import { ProductsModule } from 'src/products/products.module';
import { ProductBrandsModule } from 'src/product-brands/product-brands.module';

@Module({
  controllers: [StockReportController],
  providers: [StockReportService],
  imports: [ProductsModule, ProductBrandsModule],
})
export class StockReportModule {}
