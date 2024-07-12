import { PartialType } from '@nestjs/swagger';
import { CreateVoucherReportDto } from './create-voucher-report.dto';

export class UpdateVoucherReportDto extends PartialType(CreateVoucherReportDto) {}
