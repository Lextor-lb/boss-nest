import { PartialType } from '@nestjs/swagger';
import { CreateBrandReportDto } from './create-brand-report.dto';

export class UpdateBrandReportDto extends PartialType(CreateBrandReportDto) {}
