import { Test, TestingModule } from '@nestjs/testing';
import { CategoryReportController } from './category-report.controller';
import { CategoryReportService } from './category-report.service';

describe('CategoryReportController', () => {
  let controller: CategoryReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryReportController],
      providers: [CategoryReportService],
    }).compile();

    controller = module.get<CategoryReportController>(CategoryReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
