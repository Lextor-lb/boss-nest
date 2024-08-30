import { Test, TestingModule } from '@nestjs/testing';
import { BrandReportService } from './brand-report.service';

describe('BrandReportService', () => {
  let service: BrandReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BrandReportService],
    }).compile();

    service = module.get<BrandReportService>(BrandReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
