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
  constructor(private readonly prisma: PrismaService) {}

  whereCheckingNullClause: Prisma.WishListWhereInput = {
    isArchived: null,
  };

  async create(createWishListWithRecord: CreateWishlistDto) {
    // const {wishlistId,ecommerceUserId, productVariantIds} = createWishListWithRecord;
    const { wishlistId, productVariantIds } = createWishListWithRecord;

    // Check if the ecommerceUserId exists
    // const ecommerceUser = await this.prisma.ecommerceUser.findUnique({
    //   where: { id: ecommerceUserId },
    // });

    // if (!ecommerceUser) {
    //   throw new NotFoundException(`Ecommerce user with id ${ecommerceUserId} not found`);
    // }

    const createdWishlist = await this.prisma.wishList.create({
      data: {
        wishlistId,
        wishlistRecords: {
          create: productVariantIds.map(
            ({
              productVariantId,
              salePrice,
              createdByUserId,
              updatedByUserId,
            }) => ({
              // productVariantId,
              salePrice,
              createdByUserId,
              updatedByUserId,
              product: {
                connect: {
                  id: productVariantId, // Connect to the product associated with the variant
                },
              },
              productVariant: {
                // Include the missing productVariant property
                connect: {
                  id: productVariantId, // Connect to the existing product variant
                },
              },
            }),
          ),
        },
      },
      include: {
        wishlistRecords: {
          include: {
            product: true,
            productVariant: true,
          },
        },
      },
    });

    return createdWishlist;
  }

  // ,ecommerceUserId: number
  async findAll(options: SearchOption): Promise<any> {
    const {
      page,
      limit,
      orderBy = 'createdAt',
      orderDirection = 'desc',
    } = options;

    const total = await this.prisma.wishList.count({
      where: {
        ...this.whereCheckingNullClause,
        // ecommerceUserId
      },
    });

    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit);

    const wishLists = await this.prisma.wishList.findMany({
      where: {
        ...this.whereCheckingNullClause,
        // ecommerceUserId
      },
      // include: {ecommerceUser: {select: {name: true, email: true}}},
      skip,
      take: limit,
      orderBy: {
        [orderBy]: orderDirection,
      },
      include: {
        wishlistRecords: {
          include: {
            productVariant: true,
            product: true,
          },
        },
      },
    });

    return {
      data: wishLists.map((wish) => {
        const { wishlistRecords, ...wishListData } = wish;
        return {
          ...wishListData,
          wishlistRecords: wishlistRecords.map((record) => ({
            productVariant: record.productVariant,
            product: record.product,
          })),
        };
      }),
      total,
      page,
      limit,
      totalPages,
    };
  }

  // , ecommerceUserId: number
  async findOne(id: number): Promise<any> {
    // console.log(this.prisma.wishList.findFirst({where: {id}}));
    // Write a findOne function to output wishlist's id, product and productVarients'id
    // const wishlist = await this.prisma.wishList.findUnique({
    //   where: {
    //     id,
    //     AND: this.whereCheckingNullClause,
    //     ecommerceUserId
    //   },
    //   select: {
    //     id: true,
    //     wishlistId: true,
    //     createdAt: true,
    //     wishlistRecords: {
    //        select: {
    //         salePrice: true,
    //         productVariant: {
    //           select: {
    //             id: true,
    //             colorCode: true,
    //             product: {
    //               select: {
    //                 id: true,
    //                 name: true,
    //                 gender: true,
    //                 productType: {select: {name: true}},
    //                 productCategory: {select: {name: true}},
    //                 productFitting: {select: {name: true}}
    //               },
    //             },
    //             productSizing: {select: {name: true}}
    //           }
    //         }
    //        }
    //     }
    //   }
    // });

    const wishlist = await this.prisma.wishList.findFirst({
      where: {
        AND: [{ id }, this.whereCheckingNullClause],
      },
      include: {
        wishlistRecords: {
          include: {
            productVariant: true,
          },
        },
      },
    });

    if (!wishlist) {
      throw new NotFoundException(`Wishlist with id ${id} not found.`);
    }

    return wishlist;

    // return new WishListDetailEntity({
    //   ...wishlist,
    //   wishlistRecords: wishlist.wishlistRecords.map((or)=>({
    //     id: or.productVariant.id,
    //     productName: or.productVariant.product.name,
    //     colorCode: or.productVariant.colorCode,
    //     gender: or.productVariant.product.gender,
    //     typeName: or.productVariant.product.productType.name,
    //     categoryName: or.productVariant.product.productCategory.name,
    //     fittingName: or.productVariant.product.productFitting.name,
    //     sizingName: or.productVariant.productSizing.name,
    //     pricing: or.salePrice
    //   }))
    // })
  }

  async remove(id: number) {
    const deletedWishList = await this.prisma.wishList.update({
      where: {
        id,
      },
      data: {
        isArchived: new Date(),
      },
    });

    return new WishlistEntity(deletedWishList);
  }
}
