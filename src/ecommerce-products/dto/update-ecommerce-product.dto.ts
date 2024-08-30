import { PartialType } from '@nestjs/swagger';
import { CreateEcommerceProductDto } from './create-ecommerce-product.dto';

export class UpdateEcommerceProductDto extends PartialType(CreateEcommerceProductDto) {}
