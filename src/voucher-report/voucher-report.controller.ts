import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { VoucherReportService } from './voucher-report.service';
import { CreateVoucherReportDto } from './dto/create-voucher-report.dto';
import { UpdateVoucherReportDto } from './dto/update-voucher-report.dto';
import { SearchOption } from 'src/shared/types';

@Controller('voucher-report')
export class VoucherReportController {
  constructor(private readonly voucherReportService: VoucherReportService) {}

  @Get()
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
      orderDirection
    }
  
    return this.voucherReportService.generateReport(searchOptions);
  }

  @Get('custom')
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
      orderDirection
    }

    return this.voucherReportService.customReport(start,end,searchOptions);
  }
}
