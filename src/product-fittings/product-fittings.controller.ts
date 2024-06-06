import { Controller } from '@nestjs/common';
import { ProductFittingsService } from './product-fittings.service';

@Controller('product-fittings')
export class ProductFittingsController {
  constructor(private readonly productFittingsService: ProductFittingsService) {}
}
