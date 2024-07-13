import { Module } from '@nestjs/common';
import { BrandReportService } from './brand-report.service';
import { BrandReportController } from './brand-report.controller';

@Module({
  controllers: [BrandReportController],
  providers: [BrandReportService],
})
export class BrandReportModule {}
