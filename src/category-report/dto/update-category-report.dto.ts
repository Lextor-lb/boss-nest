import { PartialType } from '@nestjs/swagger';
import { CreateCategoryReportDto } from './create-category-report.dto';

export class UpdateCategoryReportDto extends PartialType(CreateCategoryReportDto) {}
