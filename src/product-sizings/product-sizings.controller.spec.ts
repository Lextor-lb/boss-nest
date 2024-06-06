import { Test, TestingModule } from '@nestjs/testing';
import { ProductSizingsController } from './product-sizings.controller';
import { ProductSizingsService } from './product-sizings.service';

describe('ProductSizingsController', () => {
  let controller: ProductSizingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductSizingsController],
      providers: [ProductSizingsService],
    }).compile();

    controller = module.get<ProductSizingsController>(ProductSizingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
