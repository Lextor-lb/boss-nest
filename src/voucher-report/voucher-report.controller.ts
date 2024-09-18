import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { VoucherReportService } from './voucher-report.service';
import { SearchOption } from 'src/shared/types';
import { RolesGuard } from 'src/auth/role-guard';
import { JwtAuthGuard } from 'src/auth';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/auth/role';

@Controller('voucher-report')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VoucherReportController {
  constructor(private readonly voucherReportService: VoucherReportService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async getReportData(
    @Query('page') page: number = 1,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('orderBy') orderBy: string = 'createdAt',
    @Query('orderDirection') orderDirection?: 'asc' | 'desc',
  ) {
    const searchOptions: SearchOption = {
      page,
      limit: limit ? parseInt(limit, 10) : 10,
      search,
      orderBy,
      orderDirection,
    };

    return this.voucherReportService.generateReport(searchOptions);
  }

  @Get('custom')
  @Roles(UserRole.ADMIN)
  async getCustomReportData(
    @Query('start') start: string,
    @Query('end') end: string,
    @Query('page') page: number = 1,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('orderBy') orderBy: string = 'createdAt',
    @Query('orderDirection') orderDirection?: 'asc' | 'desc',
  ) {
    const searchOptions: SearchOption = {
      page,
      limit: limit ? parseInt(limit, 10) : 10,
      search,
      orderBy,
      orderDirection,
    };

    return this.voucherReportService.customReport(start, end, searchOptions);
  }
}
