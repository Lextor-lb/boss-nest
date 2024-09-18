import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SizingReportService } from './sizing-report.service';
import { SizingReportPagination } from 'src/shared/types/sizingReport';
import { SearchOption } from 'src/shared/types';
import { JwtAuthGuard } from 'src/auth';
import { RolesGuard } from 'src/auth/role-guard';
import { Roles } from 'src/auth/role';
import { UserRole } from '@prisma/client';

@Controller('sizing-report')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SizingReportController {
  constructor(private readonly sizingReportService: SizingReportService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async getReportData(
    @Query('start') start?: string,
    @Query('end') end?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('orderBy') orderBy: string = 'createdAt',
    @Query('orderDirection') orderDirection?: 'asc' | 'desc',
  ): Promise<SizingReportPagination> {
    const searchOptions: SearchOption = {
      page,
      limit: limit ? parseInt(limit, 10) : 10,
      search,
      orderBy,
      orderDirection,
    };

    return this.sizingReportService.generateReport(start, end, searchOptions);
  }
}
