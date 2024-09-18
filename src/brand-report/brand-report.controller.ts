import {
  Controller,
  Get,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { BrandReportService } from './brand-report.service';
import { BrandReportPagination } from 'src/shared/types/brandReport';
import { SearchOption } from 'src/shared/types';
import { JwtAuthGuard } from 'src/auth';
import { RolesGuard } from 'src/auth/role-guard';
import { Roles } from 'src/auth/role';
import { UserRole } from '@prisma/client';
import { EcommerceJwtAuthGuard } from 'src/auth/ecommerce-jwt-auth.guard';

@Controller('brand-report')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BrandReportController {
  constructor(private readonly brandReportService: BrandReportService) {}

  @Get()
  @Roles(UserRole.STAFF)
  async getReportData(
    @Req() req,
    @Query('start') start?: string,
    @Query('end') end?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('orderBy') orderBy: string = 'createdAt',
    @Query('orderDirection') orderDirection?: 'asc' | 'desc',
  ): Promise<BrandReportPagination> {
    const searchOptions: SearchOption = {
      page,
      limit: limit ? parseInt(limit, 10) : 10,
      search,
      orderBy,
      orderDirection,
    };

    return this.brandReportService.generateReport(start, end, searchOptions);
  }
}
