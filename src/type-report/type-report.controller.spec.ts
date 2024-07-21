import { Test, TestingModule } from '@nestjs/testing';
import { TypeReportController } from './type-report.controller';
import { TypeReportService } from './type-report.service';

describe('TypeReportController', () => {
  let controller: TypeReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeReportController],
      providers: [TypeReportService],
    }).compile();

    controller = module.get<TypeReportController>(TypeReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
