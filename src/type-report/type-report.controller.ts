import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { TypeReportService } from './type-report.service';
import { TypeReportPagination } from 'src/shared/types/typeReport';
import { SearchOption } from 'src/shared/types';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/auth/role';
import { RolesGuard } from 'src/auth/role-guard';
import { JwtAuthGuard } from 'src/auth';

@Controller('type-report')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TypeReportController {
  constructor(private readonly typeReportService: TypeReportService) {}

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
  ): Promise<TypeReportPagination> {
    const searchOptions: SearchOption = {
      page,
      limit: limit ? parseInt(limit, 10) : 10,
      search,
      orderBy,
      orderDirection,
    };

    return this.typeReportService.generateReport(start, end, searchOptions);
  }
}
