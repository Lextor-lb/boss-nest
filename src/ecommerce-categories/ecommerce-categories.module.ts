import { Module } from '@nestjs/common';
import { EcommerceCategoriesService } from './ecommerce-categories.service';
import { EcommerceCategoriesController } from './ecommerce-categories.controller';
import { MediaModule } from 'src/media/media.module';

@Module({
  controllers: [EcommerceCategoriesController],
  providers: [EcommerceCategoriesService],
  imports: [MediaModule],
})
export class EcommerceCategoriesModule {}
