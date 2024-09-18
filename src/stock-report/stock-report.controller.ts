import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StockReportService } from './stock-report.service';
import { SearchOption } from 'src/shared/types';
import { JwtAuthGuard } from 'src/auth';
import { RolesGuard } from 'src/auth/role-guard';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/auth/role';

@Controller('stock-reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StockReportController {
  constructor(private readonly stockReportService: StockReportService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async getAnalysisData(
    @Query('page') page: number = 1,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('orderBy') orderBy: string = 'createdAt',
    @Query('orderDirection') orderDirection: 'asc' | 'desc' = 'desc',
  ) {
    const searchOptions: SearchOption = {
      page,
      limit: limit ? parseInt(limit, 10) : 10,
      search,
      orderBy,
      orderDirection,
    };

    return this.stockReportService.generateReport(searchOptions);
  }
}
