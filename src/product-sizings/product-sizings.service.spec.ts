import { Test, TestingModule } from '@nestjs/testing';
import { ProductSizingsService } from './product-sizings.service';

describe('ProductSizingsService', () => {
  let service: ProductSizingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductSizingsService],
    }).compile();

    service = module.get<ProductSizingsService>(ProductSizingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
