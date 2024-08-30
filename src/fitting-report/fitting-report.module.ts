import { Module } from '@nestjs/common';
import { FittingReportService } from './fitting-report.service';
import { FittingReportController } from './fitting-report.controller';

@Module({
  controllers: [FittingReportController],
  providers: [FittingReportService],
})
export class FittingReportModule {}
