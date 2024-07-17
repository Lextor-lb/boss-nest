import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CategoryReportService } from './category-report.service';
import { CreateCategoryReportDto } from './dto/create-category-report.dto';
import { UpdateCategoryReportDto } from './dto/update-category-report.dto';
import { CategoryReportPagination } from 'src/shared/types/categoryReport';
import { SearchOption } from 'src/shared/types';

@Controller('category-report')
export class CategoryReportController {
  constructor(private readonly categoryReportService: CategoryReportService) {}
  
  @Get()
  async getReportData(
    @Query('page') page: number = 1,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('orderBy') orderBy: string = 'createdAt',
    @Query('orderDirection') orderDirection?: 'asc' | 'desc',
  ): Promise<CategoryReportPagination> {
    const searchOptions: SearchOption = {
      page,
      limit: limit ? parseInt(limit,10) : 10,
      search,
      orderBy,
      orderDirection
    }

    return this.categoryReportService.generateReport(searchOptions);
  }
}
