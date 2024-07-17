import { Test, TestingModule } from '@nestjs/testing';
import { SizingReportService } from './sizing-report.service';

describe('SizingReportService', () => {
  let service: SizingReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SizingReportService],
    }).compile();

    service = module.get<SizingReportService>(SizingReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
