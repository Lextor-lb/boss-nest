import { Injectable } from '@nestjs/common';
import { CreateBrandReportDto } from './dto/create-brand-report.dto';
import { UpdateBrandReportDto } from './dto/update-brand-report.dto';

@Injectable()
export class BrandReportService {
  create(createBrandReportDto: CreateBrandReportDto) {
    return 'This action adds a new brandReport';
  }

  findAll() {
    return `This action returns all brandReport`;
  }

  findOne(id: number) {
    return `This action returns a #${id} brandReport`;
  }

  update(id: number, updateBrandReportDto: UpdateBrandReportDto) {
    return `This action updates a #${id} brandReport`;
  }

  remove(id: number) {
    return `This action removes a #${id} brandReport`;
  }
}
