import { Injectable } from '@nestjs/common';
import { Gender, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { EcommerceProductDetailEntity } from './entities/ecommerce-productDetail.entity';
import { MediaEntity } from 'src/media/entity/media.entity';
import { EcommerceProductVariantEntity } from './entities/ecommerce-productVariant.entity';

@Injectable()
export class EcommerceProductsService {
  constructor(private readonly prisma: PrismaService) {}
  whereCheckingNullClause: Prisma.ProductWhereInput = {
    isArchived: null,
    isEcommerce: true,
  };
  async findAllProducts(options, type: string) {
    const {
      page,
      limit,
      search = '',
      orderBy = 'createdAt',
      orderDirection = 'desc',
      sortBrand = [],
      sortGender = [],
      sortType = [],
      min,
      max,
    } = options;

    const skip = (page - 1) * limit;

    const genderConditions = this.parseGenderConditions(sortGender);
    const brandConditions = this.parseIntArray(sortBrand);
    const typeConditions = this.parseIntArray(sortType);

    const whereClause = {
      ...this.whereCheckingNullClause,
      name: { contains: search },
      ...this.buildTypeCondition(type),
      ...(genderConditions.length > 0 && { gender: { in: genderConditions } }),
      ...(brandConditions.length > 0 && {
        productBrandId: { in: brandConditions },
      }),
      ...(typeConditions.length > 0 && {
        productTypeId: { in: typeConditions },
      }),
      ...(min !== null &&
        max !== null && { salePrice: { gte: min, lte: max } }),
    };

    const total = await this.prisma.product.count({ where: whereClause });
    const totalPages = Math.ceil(total / limit);

    const products = await this.prisma.product.findMany({
      where: whereClause,
      select: this.getProductSelectClause(),
      skip,
      take: limit,
      orderBy: { [orderBy]: orderDirection },
    });

    return {
      data: products,
      total,
      page,
      limit,
      totalPages,
    };
  }

  private parseArray(param): string[] {
    return Array.isArray(param) ? param : [param];
  }

  private parseIntArray(arr): number[] {
    return this.parseArray(arr).map((item) => parseInt(item, 10));
  }

  private parseGenderConditions(sortGender: string[]): Gender[] {
    const genderArray = this.parseArray(sortGender);
    return genderArray.map((gender) => Gender[gender.toUpperCase()]);
  }

  private buildTypeCondition(type: string) {
    if (type === 'man') return { gender: Gender.MAN };
    if (type === 'lady') return { gender: Gender.LADY };
    if (type === 'unisex') return { gender: Gender.UNISEX };
    if (Number.isInteger(Number(type)))
      return { productCategoryId: Number(type) };
    return {};
  }

  private getProductSelectClause() {
    return {
      id: true,
      name: true,
      gender: true,
      salePrice: true,
      productBrand: true,
      productType: true,
    };
  }

  async findOne(id: number) {
    const {
      productBrand: { name: brandName },
      productType: { name: typeName },
      productCategory: { name: categoryName },
      productFitting: { name: fittingName },
      medias,
      productVariants,
      ...productData
    } = await this.prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        gender: true,
        salePrice: true,
        discountPrice: true,
        productBrand: { select: { name: true } },
        productType: { select: { name: true } },
        productCategory: { select: { name: true } },
        productFitting: { select: { name: true } },
        medias: { select: { url: true } },
        productVariants: {
          select: {
            id: true,
            shopCode: true,
            colorCode: true,
            barcode: true,
            productSizing: { select: { name: true } },
            media: { select: { url: true } },
          },
          where: {
            isArchived: null,
            statusStock: null,
          },
        },
      },
    });

    return new EcommerceProductDetailEntity({
      ...productData,
      productBrand: brandName,
      productType: typeName,
      productCategory: categoryName,
      productFitting: fittingName,
      mediaUrls: medias.map((m) => new MediaEntity({ url: m.url })),
      productVariants: productVariants.map((productVariant) => {
        const { productSizing, media, ...productVariantData } = productVariant;
        return new EcommerceProductVariantEntity({
          ...productVariantData,
          productSizing: productSizing.name,
          mediaUrl: media.url,
        });
      }),
    });
  }
}
