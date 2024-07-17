import { PartialType } from '@nestjs/swagger';
import { CreateFittingReportDto } from './create-fitting-report.dto';

export class UpdateFittingReportDto extends PartialType(CreateFittingReportDto) {}
