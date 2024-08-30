import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { FetchedCoupon, MessageWithCoupon, PaginatedCoupon } from 'src/shared/types/coupon';
import { SearchOption } from 'src/shared/types';
import { CouponEntity } from './entities';
import { JwtAuthGuard } from 'src/auth';
import { RemoveManyCouponDto } from './dto';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @UseGuards(JwtAuthGuard)
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
      data: coupons.map((coupon) => new CouponEntity(coupon))
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

  @Get(':couponId')
  async findOne(@Param('couponId') couponId: string) {
    const coupon = await this.couponService.findOne(couponId);
    return new CouponEntity(coupon);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':couponId')
  async update(@Param('couponId') couponId: string,
  @Req() req,
  @Body() updateCouponDto: UpdateCouponDto) {
    updateCouponDto.updatedByUserId = req.user.id;
    const updatedCoupon = await this.couponService.update(
      couponId,
      updateCouponDto
    )

    return {
      status: true,
      message: 'Updated Successfully',
      data: new CouponEntity(updatedCoupon)
    }
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Delete()
  async removeMany(
    @Body() removeManyCouponDto: RemoveManyCouponDto,
  ) {
    const result = await this.couponService.removeMany(
      removeManyCouponDto,
    );
    return {
      status: true,
      message: 'Deleted Successfully!',
      data: result,
    };
  }
}
