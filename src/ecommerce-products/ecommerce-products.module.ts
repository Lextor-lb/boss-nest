import { Module } from '@nestjs/common';
import { EcommerceProductsService } from './ecommerce-products.service';
import { EcommerceProductsController } from './ecommerce-products.controller';
import { ProductsModule } from 'src/products/products.module';
import { EcommerceCategoriesModule } from 'src/ecommerce-categories/ecommerce-categories.module';

@Module({
  controllers: [EcommerceProductsController],
  providers: [EcommerceProductsService],
  imports: [ProductsModule, EcommerceCategoriesModule],
})
export class EcommerceProductsModule {}
