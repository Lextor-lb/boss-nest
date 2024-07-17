import { Test, TestingModule } from '@nestjs/testing';
import { CategoryReportService } from './category-report.service';

describe('CategoryReportService', () => {
  let service: CategoryReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryReportService],
    }).compile();

    service = module.get<CategoryReportService>(CategoryReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
