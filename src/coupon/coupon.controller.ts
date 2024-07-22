import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { FetchedCoupon, MessageWithCoupon, PaginatedCoupon } from 'src/shared/types/coupon';
import { SearchOption } from 'src/shared/types';
import { CouponEntity } from './entities';
import { JwtAuthGuard } from 'src/auth';

@Controller('coupon')
@UseGuards(JwtAuthGuard)
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponService.create(createCouponDto);
  }

  @Get('all')
  async indexAll(): Promise<FetchedCoupon> {
    const coupons = await this.couponService.indexAll();

    return {
      status: true,
      message: 'Fetched Successfully',
      data: coupons.map((coupon) => new CouponEntity(coupon));
    }
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('orderBy') orderBy: string = 'createdAt',
    @Query('orderDirection') orderDirection: 'asc' | 'desc' = 'desc',
  ): Promise<PaginatedCoupon> {
    const searchOptions: SearchOption = {
      page,
      limit: limit ? parseInt(limit, 10) : 10,
      search,
      orderBy,
      orderDirection,
    };
    const coupons = await this.couponService.findAll(searchOptions);
    return {
      data: coupons.data.map((coupon) => new CouponEntity(coupon)),
      page: coupons.page,
      limit: coupons.limit,
      total: coupons.total,
      totalPages: coupons.totalPages,
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const coupon = await this.couponService.findOne(id);
    return new CouponEntity(coupon);
  }

  @Patch(':id')
  async update(@Param('id') id: number,
  @Req() req,
  @Body() updateCouponDto: UpdateCouponDto) {
    updateCouponDto.updatedByUserId = req.user.id;
    const updatedCoupon = await this.couponService.update(
      id,
      updateCouponDto
    )

    return {
      status: true,
      message: 'Updated Successfully',
      data: new CouponEntity(updatedCoupon)
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number
  ): Promise<MessageWithCoupon> {
    const result = await this.couponService.remove(id);

    return {
      status: true,
      message: 'Deleted Successfully',
      data: null
    };
  }
}
