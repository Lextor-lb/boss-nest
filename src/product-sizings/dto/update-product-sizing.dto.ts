import { PartialType } from '@nestjs/swagger';
import { CreateProductSizingDto } from './create-product-sizing.dto';

export class UpdateProductSizingDto extends PartialType(
  CreateProductSizingDto,
) {}
