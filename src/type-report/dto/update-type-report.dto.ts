import { PartialType } from '@nestjs/swagger';
import { CreateTypeReportDto } from './create-type-report.dto';

export class UpdateTypeReportDto extends PartialType(CreateTypeReportDto) {}
