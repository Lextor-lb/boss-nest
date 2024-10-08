import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { PrismaService } from 'src/prisma';
import { Prisma } from '@prisma/client';
import { CouponEntity } from './entities';
import { createEntityProps } from 'src/shared/utils/createEntityProps';
import { PaginatedCoupon } from 'src/shared/types/coupon';
import { SearchOption } from 'src/shared/types';
import { RemoveManyCouponDto } from './dto';

@Injectable()
export class CouponService {
  constructor(private prisma: PrismaService) {}

  whereCheckingNullClause: Prisma.CouponWhereInput = {
    isArchived: null,
  };

  async create(createCouponDto: CreateCouponDto): Promise<CouponEntity> {
    const coupon = await this.prisma.coupon.create({
      data: createCouponDto as Prisma.CouponCreateInput,
    });

    return new CouponEntity(createEntityProps(coupon));
  }

  async indexAll(): Promise<CouponEntity[]> {
    const coupons = await this.prisma.coupon.findMany({
      where: this.whereCheckingNullClause,
    });

    return coupons.map((coupon) => new CouponEntity(createEntityProps(coupon)));
  }

  async findAll(searchOptions: SearchOption): Promise<PaginatedCoupon> {
    const { page, limit, search, orderBy, orderDirection } = searchOptions;

    const [total, rawCoupons] = await this.prisma.$transaction([
      this.prisma.coupon.count({
        where: {
          ...this.whereCheckingNullClause,
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      }),
      this.prisma.coupon.findMany({
        where: {
          ...this.whereCheckingNullClause,
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          [orderBy]: orderDirection,
        },
      }),
    ]);

    const coupons = rawCoupons.map((coupon) => new CouponEntity(coupon)); // Map raw data to CouponEntity

    const totalPages = Math.ceil(total / limit);

    return {
      data: coupons,
      page,
      limit,
      total,
      totalPages,
    };
  }

  async findOne(couponId: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { couponId },
    });

    if (!coupon) {
      throw new NotFoundException(`Coupon with Id ${couponId} not found`);
    }

    return coupon;
  }

  async update(couponId: string, updateCouponDto: UpdateCouponDto) {
    const coupon = await this.findOne(couponId);

    return this.prisma.coupon.update({
      where: { couponId },
      data: updateCouponDto,
    });
  }

  async remove(id: number): Promise<CouponEntity> {
    const deletedCoupon = await this.prisma.coupon.update({
      where: {
        id,
      },
      data: {
        isArchived: new Date(),
      },
    });

    return new CouponEntity(deletedCoupon);
  }

  async removeMany(removeManyCouponDto: RemoveManyCouponDto) {
    const { ids } = removeManyCouponDto;

    const { count } = await this.prisma.coupon.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        isArchived: new Date(),
      },
    });

    return {
      status: true,
      message: `Coupons with ids count of ${count} have been deleted successfully.`,
      archivedIds: ids,
    };
  }
}
