import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BrandReportService } from './brand-report.service';
import { CreateBrandReportDto } from './dto/create-brand-report.dto';
import { UpdateBrandReportDto } from './dto/update-brand-report.dto';
import { BrandReportPagination } from 'src/shared/types/brandReport';
import { SearchOption } from 'src/shared/types';

@Controller('brand-report')
export class BrandReportController {
  constructor(private readonly brandReportService: BrandReportService) {}
   
  @Get()
  async getReportData(
    @Query('page') page: number = 1,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('orderBy') orderBy: string = 'createdAt',
    @Query('orderDirection') orderDirection?: 'asc' | 'desc',
  ): Promise<BrandReportPagination> {
    const searchOptions: SearchOption = {
      page,
      limit: limit ? parseInt(limit, 10) : 10,
      search,
      orderBy,
      orderDirection
    }
  
    return this.brandReportService.generateReport(searchOptions);
  }
}
