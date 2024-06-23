import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import {
  MediaDto,
  CreateProductDto,
  ProductBrandEntity,
  ProductSizingEntity,
  ProductVariantEntity,
  ProductFittingEntity,
  ProductCategoryEntity,
  MediaEntity,
  ProductTypeEntity,
  ProductEntity,
  MediaService,
  ProductVariantsService,
  ProductPagination,
  SearchOption,
  PrismaService,
} from 'src';
import { createEntityProps } from 'src/shared/utils/createEntityProps';

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
          const {
            productVariants: productVariantsData,
            imageFilesUrl,
            ...productData
          } = createProductDto;

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
          let productVariants = [];
          if (productVariantsData && productVariantsData.length > 0) {
            const variantPromises = productVariantsData.map(
              async (variantDto) => {
                return this.productVariantsService.createWithTransaction(
                  transactionClient,
                  {
                    ...variantDto,
                    productId: product.id,
                  },
                );
              },
            );
            productVariants = await Promise.all(variantPromises);
          }

          return {
            ...product,
            medias,
            productVariants,
          };
        },
      );
      return new ProductEntity({
        ...product,
        medias: product.medias.map((media) => new MediaEntity(media)),
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error creating product');
    }
  }

  async indexAll() {
    return await this.prisma.product.findMany({
      include: { productVariants: true },
    });
  }

  async calculateTotalSalePrice() {
    const products = await this.indexAll();

    const totalSalePrice = products.reduce((total, product) => {
      const quantity = product.productVariants.length;
      return total + quantity * product.salePrice;
    }, 0);

    return totalSalePrice;
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
    const totalStock = await this.productVariantsService.countAvailableStock(); // Make sure this is awaited and is a number
    const totalSalePrice = await this.calculateTotalSalePrice();
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
      // productVariants: true,
    };

    const products = await this.prisma.product.findMany({
      where: whereClause,
      include: includeClause,
      skip,
      take: limit,
      orderBy: orderByClause,
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
        // productVariants: product.productVariants.map(
        //   (productVariant) => new ProductVariantEntity(productVariant),
        // ),
      });
    });

    return {
      totalStock,
      totalSalePrice,
      data: productEntities,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<ProductEntity> {
    const includeClause = {
      productBrand: true,
      productType: true,
      productCategory: true,
      productFitting: true,
      medias: true,
      productVariants: true,
    };

    const nestedIncludeClause = {
      ...includeClause,
      productVariants: { include: { productSizing: true, media: true } },
    };

    const product = await this.prisma.product.findUnique({
      where: { id },
      include: nestedIncludeClause,
    });

    return new ProductEntity({
      ...product,
      productType: new ProductTypeEntity(product.productType),
      productBrand: new ProductBrandEntity(product.productBrand),
      productCategory: new ProductCategoryEntity(product.productCategory),
      productFitting: new ProductFittingEntity(product.productFitting),
      medias: product.medias.map(
        (media) => new MediaEntity({ id: media.id, url: media.url }),
      ),
      productVariants: product.productVariants.map(
        (productVariant) =>
          new ProductVariantEntity({
            ...productVariant,
            media: new MediaEntity(productVariant.media),

            productSizing: new ProductSizingEntity(
              productVariant.productSizing,
            ),
          }),
      ),
    });
  }
}
