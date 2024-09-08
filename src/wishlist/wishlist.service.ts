import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { PrismaService } from 'src/prisma';
import { Prisma, PrismaClient } from '@prisma/client';
import { WishlistEntity } from './entities/wishlist.entity';
import { SearchOption } from 'src/shared/types';
import { WishListDetailEntity } from './entities/wishlistDetail.entity';
import { wishlistRecordEntity } from './entities/wishlistRecord.entity';
import { MediaEntity } from 'src/media';

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  whereCheckingNullClause: Prisma.WishListWhereInput = {
    isArchived: null,
  };

  async create(createWishListWithRecord: CreateWishlistDto) {
    const {ecommerceUserId, productVariantIds} = createWishListWithRecord;

    //Check if the ecommerceUserId exists
    const ecommerceUser = await this.prisma.ecommerceUser.findUnique({
      where: { id: ecommerceUserId },
    });

    if (!ecommerceUser) {
      throw new NotFoundException(`Ecommerce user with id ${ecommerceUserId} not found`);
    }

    let wishlistId = generateRandomId(6);

    console.log(wishlistId);

    //Check if a wishlist with the same wishlistId already exists
    const existingWishlist = await this.prisma.wishList.findUnique({
      where: {wishlistId}
    });

    if(existingWishlist){
      throw new ConflictException(`Wishlist with id ${wishlistId} already exists.`)
    }

    const createdWishlist = await this.prisma.wishList.create({
      data: {
        wishlistId,
        ecommerceUserId,
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

  async findAll(options: SearchOption,ecommerceUserId: number): Promise<any> {
    const {
      page,
      limit,
      orderBy = 'createdAt',
      orderDirection = 'desc',
    } = options;

    const total = await this.prisma.wishList.count({
      where: {
        ...this.whereCheckingNullClause,
        ecommerceUserId
      }
    })

    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit);

    const wishLists = await this.prisma.wishList.findMany({
      where: {
        ...this.whereCheckingNullClause,
        ecommerceUserId,
      },
      include: {
        ecommerceUser: { select: { name: true, email: true } },
        wishlistRecords: {
          include: {
            productVariant: {
              include: {
                media: {select: {url: true}},
                product: {
                  select: {
                    name: true,
                    discountPrice: true,
                    gender: true,
                    productType: { select: { name: true } },
                    productCategory: { select: { name: true } },
                    productFitting: { select: { name: true } },
                    salePrice: true
                  },
                },
                productSizing: { select: { name: true } },
              },
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        [orderBy]: orderDirection,
      },
    });

    return {
      data: wishLists.map((wish) => {
        const { wishlistRecords, ecommerceUser, ...wishListData } = wish;
  
        const wishListDetailEntity = new WishListDetailEntity({
          ...wishListData,
          customerName: ecommerceUser.name,
          customerEmail: ecommerceUser.email,
          wishlistRecords: wishlistRecords.map((record) => ({
            id: record.id,
            productName: record.productVariant.product.name,
            image: new MediaEntity({url: record.productVariant.media.url}),
            gender: record.productVariant.product.gender,
            pricing: record.productVariant.product.salePrice,
            discountPrice: record.productVariant.product.discountPrice,
            colorCode: record.productVariant.colorCode,
            // Related fields from Product
            typeName: record.productVariant.product.productType.name,
            categoryName: record.productVariant.product.productCategory.name,
            fittingName: record.productVariant.product.productFitting.name,
            // From ProductSizing (via ProductVariant)
            sizingName: record.productVariant.productSizing?.name,
          })),
        });
  
        return wishListDetailEntity;
      }),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: number, ecommerceUserId: number): Promise<any> {
    const wishlist = await this.prisma.wishList.findFirst({
      where: {
        AND: [
          { id },
          {ecommerceUserId},
          this.whereCheckingNullClause,
        ],
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

function generateRandomId(length){
  const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charLength = char.length;

  for(let i = 0; i< length; i++){
    result += char.charAt(Math.floor(Math.random() * charLength)).toString();
  }

  return result;
}