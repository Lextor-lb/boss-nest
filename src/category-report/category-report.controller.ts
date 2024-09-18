import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CategoryReportService } from './category-report.service';
import { CategoryReportPagination } from 'src/shared/types/categoryReport';
import { SearchOption } from 'src/shared/types';
import { RolesGuard } from 'src/auth/role-guard';
import { JwtAuthGuard } from 'src/auth';
import { Roles } from 'src/auth/role';
import { UserRole } from '@prisma/client';

@Controller('category-report')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoryReportController {
  constructor(private readonly categoryReportService: CategoryReportService) {}

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
  ): Promise<CategoryReportPagination> {
    const searchOptions: SearchOption = {
      page,
      limit: limit ? parseInt(limit, 10) : 10,
      search,
      orderBy,
      orderDirection,
    };

    return this.categoryReportService.generateReport(start, end, searchOptions);
  }
}
