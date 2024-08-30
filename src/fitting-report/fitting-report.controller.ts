import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FittingReportService } from './fitting-report.service';
import { CreateFittingReportDto } from './dto/create-fitting-report.dto';
import { UpdateFittingReportDto } from './dto/update-fitting-report.dto';
import { FittingReportPagination } from 'src/shared/types/fittingReport';
import { SearchOption } from 'src/shared/types';

@Controller('fitting-report')
export class FittingReportController {
  constructor(private readonly fittingReportService: FittingReportService) {}

  @Get()
  async getReportData(
    @Query('start') start?: string,
    @Query('end') end?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('orderBy') orderBy: string = 'createdAt',
    @Query('orderDirection') orderDirection?: 'asc' | 'desc'
  ): Promise<FittingReportPagination> {
    const searchOptions: SearchOption = {
      page,
      limit: limit ? parseInt(limit, 10) : 10,
      search,
      orderBy,
      orderDirection,
    };

    return this.fittingReportService.generateReport(start,end,searchOptions);
  }

 
}
