import { Module } from '@nestjs/common';
import { VoucherReportService } from './voucher-report.service';
import { VoucherReportController } from './voucher-report.controller';
import { PrismaService } from 'src/prisma';
import { VouchersModule } from 'src/vouchers/vouchers.module';

@Module({
  imports: [VouchersModule],
  controllers: [VoucherReportController],
  providers: [VoucherReportService, PrismaService],
})
export class VoucherReportModule {}
