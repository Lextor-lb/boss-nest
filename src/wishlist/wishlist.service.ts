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
    const { ecommerceUserId, productId,salePrice } = createWishListWithRecord;

    //Check if the product already exists in the user's wishlist
    const existingWishlistRecord = await this.prisma.wishListRecord.findFirst({
      where: {
        productId: productId,
        wishlist: {
          ecommerceUserId: ecommerceUserId,
        }
      }
    })

    if(existingWishlistRecord){
      throw new ConflictException('Product already exists in wishlist')
    }
 
    // Check if the ecommerceUserId exists
    const ecommerceUser = await this.prisma.ecommerceUser.findUnique({
      where: { id: ecommerceUserId },
    });
  
    if (!ecommerceUser) {
      throw new NotFoundException(`Ecommerce user with id ${ecommerceUserId} not found`);
    }
    let wishlistId = generateRandomId(6);

    // Check if a wishlist with the same wishlistId already exists
    const existingWishlist = await this.prisma.wishList.findUnique({
      where: { wishlistId },
    });

    if (existingWishlist) {
      throw new ConflictException(`Wishlist with id ${wishlistId} already exists`);
    }

    const createdWishlist = await this.prisma.wishList.create({
      data: {
        wishlistId,
        ecommerceUserId,
        wishlistRecords: {
          create: {
            productId,
            salePrice,
            // createdByUserId: createWishListWithRecord.createdByUserId || null,
            // updatedByUserId: createWishListWithRecord.updatedByUserId || null,
          },
        },
      },
      include: {
        wishlistRecords: {
          include: {
            product: true, // Include the product data
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
        ecommerceUser: { 
          select: { name: true, email: true } 
        },
        wishlistRecords: {
          include: {
            product: {
              include: {
                productType: { select: { name: true } },
                productCategory: { select: { name: true } },
                productFitting: { select: { name: true } },
                productVariants: {
                  select: {
                    colorCode: true,
                    media: true,
                    productSizing: { select: { name: true } },
                  },
                },
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
  
        // Handling the first product variant (main photo)
        return new WishListDetailEntity({
          ...wishListData,
          customerName: ecommerceUser.name,
          customerEmail: ecommerceUser.email,
          wishlistRecords: wishlistRecords.map((record) => {
            const mainVariant = record.product.productVariants[0]; // Take the first variant
  
            return {
              id: record.id,
              productId: record.product.id,
              productName: record.product.name,
              image: new MediaEntity({ url: mainVariant.media?.url || '' }), // Fallback in case there's no media
              gender: record.product.gender,
              pricing: record.product.salePrice,
              discountPrice: record.product.discountPrice,
              colorCode: mainVariant.colorCode, // Single color from the first variant
              // Related fields from Product
              typeName: record.product.productType.name,
              categoryName: record.product.productCategory.name,
              fittingName: record.product.productFitting.name,
              // Product Sizing
              sizingName: mainVariant.productSizing?.name || 'N/A', // Fallback for sizing
            };
          }),
        });
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
            product: true,
          },
        },
      },
    });

    if (!wishlist) {
      throw new NotFoundException(`Wishlist with id ${id} not found.`);
    }

    return wishlist;
  }

  async remove(id: number): Promise<void> {
    // Check if the wishlist exists
    const wishlist = await this.prisma.wishList.findUnique({
      where: { id },
      include: { wishlistRecords: true },
    });

    if (!wishlist) {
      throw new NotFoundException(`WishList with ID ${id} not found`);
    }

    // Delete all related wishlist records first
    await this.prisma.wishListRecord.deleteMany({
      where: { wishlistId: wishlist.id },
    });

    // Now delete the wishlist itself
    await this.prisma.wishList.delete({
      where: { id: wishlist.id },
    });
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