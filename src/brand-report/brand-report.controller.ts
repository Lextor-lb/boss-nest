import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BrandReportService } from './brand-report.service';
import { CreateBrandReportDto } from './dto/create-brand-report.dto';
import { UpdateBrandReportDto } from './dto/update-brand-report.dto';

@Controller('brand-report')
export class BrandReportController {
  constructor(private readonly brandReportService: BrandReportService) {}

  @Post()
  create(@Body() createBrandReportDto: CreateBrandReportDto) {
    return this.brandReportService.create(createBrandReportDto);
  }

  @Get()
  findAll() {
    return this.brandReportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandReportService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBrandReportDto: UpdateBrandReportDto) {
    return this.brandReportService.update(+id, updateBrandReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandReportService.remove(+id);
  }
}
