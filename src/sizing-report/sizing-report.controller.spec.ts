import { Test, TestingModule } from '@nestjs/testing';
import { SizingReportController } from './sizing-report.controller';
import { SizingReportService } from './sizing-report.service';

describe('SizingReportController', () => {
  let controller: SizingReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SizingReportController],
      providers: [SizingReportService],
    }).compile();

    controller = module.get<SizingReportController>(SizingReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
