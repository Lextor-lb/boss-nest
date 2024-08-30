import { Test, TestingModule } from '@nestjs/testing';
import { FittingReportService } from './fitting-report.service';

describe('FittingReportService', () => {
  let service: FittingReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FittingReportService],
    }).compile();

    service = module.get<FittingReportService>(FittingReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
