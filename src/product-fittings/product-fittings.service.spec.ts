import { Test, TestingModule } from '@nestjs/testing';
import { ProductFittingsService } from './product-fittings.service';

describe('ProductFittingsService', () => {
  let service: ProductFittingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductFittingsService],
    }).compile();

    service = module.get<ProductFittingsService>(ProductFittingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
