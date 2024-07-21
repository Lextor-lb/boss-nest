import { Test, TestingModule } from '@nestjs/testing';
import { FittingReportController } from './fitting-report.controller';
import { FittingReportService } from './fitting-report.service';

describe('FittingReportController', () => {
  let controller: FittingReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FittingReportController],
      providers: [FittingReportService],
    }).compile();

    controller = module.get<FittingReportController>(FittingReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
