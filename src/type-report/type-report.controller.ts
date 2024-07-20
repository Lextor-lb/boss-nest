import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TypeReportService } from './type-report.service';
import { CreateTypeReportDto } from './dto/create-type-report.dto';
import { UpdateTypeReportDto } from './dto/update-type-report.dto';
import { TypeReportPagination } from 'src/shared/types/typeReport';
import { SearchOption } from 'src/shared/types';

@Controller('type-report')
export class TypeReportController {
  constructor(private readonly typeReportService: TypeReportService) {}

  @Get()
  async getReportData(
    @Query('start') start?: string,
    @Query('end') end?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('orderBy') orderBy: string = 'createdAt',
    @Query('orderDirection') orderDirection?: 'asc' | 'desc'
  ): Promise<TypeReportPagination> {
    const searchOptions: SearchOption = {
      page,
      limit: limit ? parseInt(limit, 10) : 10,
      search,
      orderBy,
      orderDirection
    }

    return this.typeReportService.generateReport(start,end,searchOptions);
  }
}
