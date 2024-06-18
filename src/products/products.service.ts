// import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { ProductEntity } from './entity/product.entity';
import { ProductTypeEntity } from 'src/product-types/entity/product-type.entity';
import { ProductPagination, SearchOption } from '../shared/types';
import { MediaService } from 'src/media/media.service';
import { MediaEntity } from 'src/media/entity/media.entity';
import { ProductBrandEntity } from 'src/product-brands/entity/product-brand.entity';
import { ProductCategoryEntity } from 'src/product-categories/entity/product-category.entity';
import { ProductFittingEntity } from 'src/product-fittings/entity/product-fitting.entity';
import { MediaDto } from 'src/media/dto/media.dto';
import { ProductVariantsService } from 'src/product-variants/product-variants.service';
import { ProductVariantEntity } from 'src/product-variants/entity/product-variant.entity';
// import { ProductVariantsService } from 'src/product-variants/product-variants.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService, // Inject MediaService
    private readonly productVariantsService: ProductVariantsService, // Inject ProductVariantService
  ) {}
  whereCheckingNullClause: Prisma.ProductWhereInput = {
    isArchived: null,
  };

  async create(createProductDto: CreateProductDto) {
    try {
      const product = await this.prisma.$transaction(
        async (transactionClient: PrismaClient) => {
          // Create product
          const { productVariants, imageFilesUrl, ...productData } =
            createProductDto;

          const product = await transactionClient.product.create({
            data: productData,
          });

          // Save product images
          const uploadMedia = imageFilesUrl.map((url) => {
            const mediaDto = new MediaDto();
            mediaDto.url = url;
            mediaDto.productId = product.id;
            return this.mediaService.saveMedia(transactionClient, mediaDto);
          });
          const medias = await Promise.all(uploadMedia);

          // Create product variants
          let variants = [];
          if (productVariants && productVariants.length > 0) {
            const variantPromises = productVariants.map(async (variantDto) => {
              return this.productVariantsService.createWithTransaction(
                transactionClient,
                {
                  ...variantDto,
                  productId: product.id,
                },
              );
            });
            variants = await Promise.all(variantPromises);
          }

          return {
            ...product,
            medias,
            variants,
          };
        },
      );
      // return product.variants;
      // return files;
      return new ProductEntity({
        ...product,
        medias: product.medias.map((media) => new MediaEntity(media)),
      });
    } catch (error) {
      console.error(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('The barcode must be unique.');
        }
      }
      throw new BadRequestException('Error creating product');
    }
  }

  async findAll({
    page,
    limit,
    search = '',
    orderBy = 'createdAt',
    orderDirection = 'desc',
  }: SearchOption): Promise<ProductPagination> {
    const total = await this.prisma.product.count({
      where: this.whereCheckingNullClause,
    });
    const skip = (page - 1) * limit;

    const whereClause = {
      ...this.whereCheckingNullClause,
      name: {
        contains: search,
      },
    };

    const orderByClause = {
      [orderBy]: orderDirection,
    };

    const includeClause = {
      productBrand: true,
      productType: true,
      productCategory: true,
      productFitting: true,
      medias: true,
      productVariants: true,
    };

    const products = await this.prisma.product.findMany({
      where: whereClause,
      include: includeClause,
      skip,
      take: limit,
      orderBy: orderByClause,
    });

    const createEntityProps = (entity: {
      id: number;
      name: string;
      isArchived: Date;
    }) => ({
      id: entity.id,
      name: entity.name,
      isArchived: entity.isArchived,
    });

    const productEntities = products.map((product) => {
      return new ProductEntity({
        ...product,
        productType: new ProductTypeEntity(
          createEntityProps(product.productType),
        ),
        productBrand: new ProductBrandEntity(
          createEntityProps(product.productBrand),
        ),
        productCategory: new ProductCategoryEntity(
          createEntityProps(product.productCategory),
        ),
        productFitting: new ProductFittingEntity(
          createEntityProps(product.productFitting),
        ),
        medias: product.medias.map(
          (media) => new MediaEntity({ id: media.id, url: media.url }),
        ),
        productVariants: product.productVariants.map(
          (productVariant) => new ProductVariantEntity(productVariant),
        ),
      });
    });

    return { data: productEntities, total, page, limit };
  }
}
