import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { PrismaService } from 'src/prisma';
import { Prisma, PrismaClient } from '@prisma/client';
import { WishlistEntity } from './entities/wishlist.entity';
import { SearchOption } from 'src/shared/types';
import { WishListDetailEntity } from './entities/wishlistDetail.entity';

@Injectable()
export class WishlistService {
  constructor(
    private readonly prisma: PrismaService,
  ){}
  whereCheckingNullClause: Prisma.WishListWhereInput = {
    isArchived: null
  }

  async create(createWishListWithRecord: CreateWishlistDto) {
    const {wishlistId,ecommerceUserId, productVariantIds} = createWishListWithRecord;

    // Check if the ecommerceUserId exists
    const ecommerceUser = await this.prisma.ecommerceUser.findUnique({
      where: { id: ecommerceUserId },
    });

    if (!ecommerceUser) {
      throw new NotFoundException(`Ecommerce user with id ${ecommerceUserId} not found`);
    }

    return this.prisma.wishList.create({
      data: {
        wishlistId,
        ecommerceUserId,
        wishlistRecords: {
          create: productVariantIds.map(({ productVariantId, salePrice, createdByUserId, updatedByUserId }) => ({
            productVariantId,
            salePrice,
            createdByUserId,
            updatedByUserId,
          })),
        },
      },
      include: {
        wishlistRecords: {
          include: {
            productVariant: true,
          }
        }
      }
    })
  }

  async findAll(options: SearchOption,ecommerceUserId: number): Promise<any> {
    const {
      page,
      limit,
      orderBy = 'createdAt',
      orderDirection = 'desc'
    } = options;

    const total = await this.prisma.wishList.count({
      where: {
        ...this.whereCheckingNullClause,
        ecommerceUserId
      }
    })

    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(total/limit);

    const wishLists = await this.prisma.wishList.findMany({
      where: {
        ...this.whereCheckingNullClause,
        ecommerceUserId
      },
      include: {ecommerceUser: {select: {name: true, email: true}}},
      skip,
      take: limit,
      orderBy: {
        [orderBy]: orderDirection
      }
    });

    return {
      data: wishLists.map((wish) => {
        const {ecommerceUser, ...wishListData} = wish;
        return new WishlistEntity({
          ...wishListData,
          customerName: ecommerceUser.name,
          customerEmail: ecommerceUser.email
        })
      }),
      total,
      page,
      limit,
      totalPages
    }
  }

  async findOne(id: number, ecommerceUserId: number): Promise<any> {
    const {wishlistRecords, ...wishlist} = await this.prisma.wishList.findUnique({
      where: {id, AND: this.whereCheckingNullClause,ecommerceUserId},
      select: {
        id: true,
        wishlistId: true,
        createdAt: true,
        wishlistRecords: {
           select: {
            salePrice: true,
            productVariant: {
              select: {
                id: true,
                colorCode: true,
                product: {
                  select: {
                    name: true,
                    gender: true,
                    productType: {select: {name: true}},
                    productCategory: {select: {name: true}},
                    productFitting: {select: {name: true}}
                  },
                },
                productSizing: {select: {name: true}}
              }
            }
           }
        }
      }
    });

    return new WishListDetailEntity({
      ...wishlist,
      wishlistRecords: wishlistRecords.map((or)=>({
        id: or.productVariant.id,
        productName: or.productVariant.product.name,
        colorCode: or.productVariant.colorCode,
        gender: or.productVariant.product.gender,
        typeName: or.productVariant.product.productType.name,
        categoryName: or.productVariant.product.productCategory.name,
        fittingName: or.productVariant.product.productFitting.name,
        sizingName: or.productVariant.productSizing.name,
        pricing: or.salePrice
      }))
    })
  }

  async remove(id: number) {
    const deletedWishList = await this.prisma.wishList.update({
      where: {
        id,
      },
      data: {
        isArchived: new Date()
      }
    });

    return new WishlistEntity(deletedWishList);
  }
}
