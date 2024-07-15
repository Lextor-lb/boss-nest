import { Module } from '@nestjs/common';
import { BrandReportService } from './brand-report.service';
import { BrandReportController } from './brand-report.controller';
import { ProductBrandsModule } from 'src/product-brands/product-brands.module';

@Module({
  imports: [ProductBrandsModule],
  controllers: [BrandReportController],
  providers: [BrandReportService],
})
export class BrandReportModule {}
