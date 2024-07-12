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

  @Post()
  create(@Body() createVoucherReportDto: CreateVoucherReportDto) {
    return this.voucherReportService.create(createVoucherReportDto);
  }

  @Get()
  findAll() {
    return this.voucherReportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.voucherReportService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVoucherReportDto: UpdateVoucherReportDto) {
    return this.voucherReportService.update(+id, updateVoucherReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.voucherReportService.remove(+id);
  }
}
