import { Test, TestingModule } from '@nestjs/testing';
import { VoucherReportController } from './voucher-report.controller';
import { VoucherReportService } from './voucher-report.service';

describe('VoucherReportController', () => {
  let controller: VoucherReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoucherReportController],
      providers: [VoucherReportService],
    }).compile();

    controller = module.get<VoucherReportController>(VoucherReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
