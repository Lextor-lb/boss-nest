import { Module } from '@nestjs/common';
import { TypeReportService } from './type-report.service';
import { TypeReportController } from './type-report.controller';
import { ProductTypesModule } from 'src/product-types/product-types.module';
import { PrismaService } from 'src/prisma';
import { ProductTypesService } from 'src/product-types';

@Module({
  imports: [ProductTypesModule],
  controllers: [TypeReportController],
  providers: [TypeReportService,PrismaService,ProductTypesService],
})
export class TypeReportModule {}
