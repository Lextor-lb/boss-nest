import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SizingReportService } from './sizing-report.service';
import { CreateSizingReportDto } from './dto/create-sizing-report.dto';
import { UpdateSizingReportDto } from './dto/update-sizing-report.dto';
import { SizingReportPagination } from 'src/shared/types/sizingReport';
import { SearchOption } from 'src/shared/types';

@Controller('sizing-report')
export class SizingReportController {
  constructor(private readonly sizingReportService: SizingReportService) {}

 @Get()
 async getReportData(
  @Query('page') page: number = 1,
  @Query('limit') limit?: string,
  @Query('search') search?: string,
  @Query('orderBy') orderBy: string = 'createdAt',
  @Query('orderDirection') orderDirection?: 'asc' | 'desc'
 ): Promise<SizingReportPagination> {
  const searchOptions: SearchOption = {
    page,
    limit: limit ? parseInt(limit, 10) : 10,
    search,
    orderBy,
    orderDirection
  }

  return this.sizingReportService.generateReport(searchOptions);
 }
}
