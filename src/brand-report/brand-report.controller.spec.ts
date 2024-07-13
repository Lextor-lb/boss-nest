import { Test, TestingModule } from '@nestjs/testing';
import { BrandReportController } from './brand-report.controller';
import { BrandReportService } from './brand-report.service';

describe('BrandReportController', () => {
  let controller: BrandReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandReportController],
      providers: [BrandReportService],
    }).compile();

    controller = module.get<BrandReportController>(BrandReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
