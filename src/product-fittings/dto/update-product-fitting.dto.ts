import { PartialType } from '@nestjs/swagger';
import { CreateProductFittingDto } from './create-product-fitting.dto';

export class UpdateProductFittingDto extends PartialType(
  CreateProductFittingDto,
) {}
