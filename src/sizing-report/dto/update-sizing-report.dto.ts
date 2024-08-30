import { PartialType } from '@nestjs/swagger';
import { CreateSizingReportDto } from './create-sizing-report.dto';

export class UpdateSizingReportDto extends PartialType(CreateSizingReportDto) {}
