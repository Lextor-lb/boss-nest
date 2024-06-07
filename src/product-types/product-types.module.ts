import { Module } from '@nestjs/common';
import { ProductTypesService } from './product-types.service';
import { ProductTypesController } from './product-types.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ProductTypesController],
  providers: [ProductTypesService],
  imports: [PrismaModule],
})
export class ProductTypesModule {}
