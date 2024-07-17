import { Test, TestingModule } from '@nestjs/testing';
import { TypeReportService } from './type-report.service';

describe('TypeReportService', () => {
  let service: TypeReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeReportService],
    }).compile();

    service = module.get<TypeReportService>(TypeReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
