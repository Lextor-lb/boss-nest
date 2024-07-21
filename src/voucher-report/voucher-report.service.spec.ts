import { Test, TestingModule } from '@nestjs/testing';
import { VoucherReportService } from './voucher-report.service';

describe('VoucherReportService', () => {
  let service: VoucherReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VoucherReportService],
    }).compile();

    service = module.get<VoucherReportService>(VoucherReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
