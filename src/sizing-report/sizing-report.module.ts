import { Module } from '@nestjs/common';
import { SizingReportService } from './sizing-report.service';
import { SizingReportController } from './sizing-report.controller';
import { ProductTypesModule } from 'src/product-types/product-types.module';
import { PrismaService } from 'src/prisma';
import { ProductSizingsService } from 'src/product-sizings';

@Module({
  imports: [ProductTypesModule],
  controllers: [SizingReportController],
  providers: [SizingReportService, PrismaService,ProductSizingsService],
})
export class SizingReportModule {}
