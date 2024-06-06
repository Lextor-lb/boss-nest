import { Test, TestingModule } from '@nestjs/testing';
import { ProductFittingsController } from './product-fittings.controller';
import { ProductFittingsService } from './product-fittings.service';

describe('ProductFittingsController', () => {
  let controller: ProductFittingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductFittingsController],
      providers: [ProductFittingsService],
    }).compile();

    controller = module.get<ProductFittingsController>(ProductFittingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
