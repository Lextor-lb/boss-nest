import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { ProductDetailEntity } from './entity/productDetail.entity';
import { RemoveManyProductDto } from './dto/removeMany-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { deleteFile } from 'src/shared/utils/deleteOldImageFile';

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
        productVariants: product.productVariants.map(
          (pv) => new ProductVariantEntity(pv),
        ),
        medias: product.medias.map((media) => new MediaEntity(media)),
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error creating product');
    }
  }

  async indexAll() {
    return await this.prisma.product.findMany({
      where: this.whereCheckingNullClause,
      include: {
        productVariants: {
          where: {
            isArchived: null,
            statusStock: null,
          },
        },
      },
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

  async findAll(options: SearchOption): Promise<ProductPagination> {
    const {
      page,
      limit,
      search = '',
      orderBy = 'createdAt',
      orderDirection = 'desc',
    } = options;
    const total = await this.prisma.product.count({
      where: this.whereCheckingNullClause,
    });
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit);
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
      productVariants: { where: { isArchived: null, statusStock: null } },
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
        productVariants: product.productVariants.map(
          (productVariant) => new ProductVariantEntity(productVariant),
        ),
      });
    });

    return {
      totalStock,
      totalSalePrice,
      data: productEntities,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: number): Promise<ProductDetailEntity> {
    const includeClause = {
      productBrand: true,
      productType: true,
      productCategory: true,
      productFitting: true,
      medias: true,
      productVariants: {
        include: { productSizing: true, media: true },
        where: {
          isArchived: null,
        },
      },
    };

    const product = await this.prisma.product.findUnique({
      where: { id },
      include: includeClause,
    });

    return new ProductDetailEntity({
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
        (productVariant) =>
          new ProductVariantEntity({
            ...productVariant,
            media: new MediaEntity(productVariant.media),

            productSizing: new ProductSizingEntity(
              createEntityProps(productVariant.productSizing),
            ),
          }),
      ),
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<any> {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id, AND: this.whereCheckingNullClause },
    });
    if (!existingProduct) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    const { imageFilesUrl, ...productData } = updateProductDto;
    await this.prisma.$transaction(async (transactionClient: PrismaClient) => {
      if (imageFilesUrl) {
        const uploadMedia = imageFilesUrl.map((url) => {
          const mediaDto = new MediaDto();
          mediaDto.url = url;
          mediaDto.productId = existingProduct.id;
          return this.mediaService.saveMedia(transactionClient, mediaDto);
        });
        await Promise.all(uploadMedia);
      }

      await transactionClient.product.update({
        where: { id },
        data: productData,
      });
    });
    return {
      status: true,
      message: 'Updated Successfully!',
    };
  }

  async removeProductMedia(id: number) {
    try {
      const media = this.prisma.media.findUnique({ where: { id } });

      if (media) deleteFile((await media).url);
      await this.mediaService.removeMedia(id);

      return {
        status: true,
        message: `Deleted productImage successfully.`,
      };
    } catch (error) {
      throw new BadRequestException('Failed to delete!');
    }
  }

  async remove(id: number) {
    await this.prisma.product.update({
      where: { id },
      data: { isArchived: new Date() },
    });
    await this.prisma.productVariant.updateMany({
      where: { productId: id },
      data: { isArchived: new Date() },
    });

    return {
      status: true,
      message: `Deleted product successfully.`,
    };
  }

  async removeMany(removeManyProductDto: RemoveManyProductDto) {
    const { ids } = removeManyProductDto;

    // Archive the ProductType instances
    const archivedProducts = await this.prisma.product.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        isArchived: new Date(),
      },
    });

    // Archive the related ProductCategory instances
    const archivedProductVariants = await this.prisma.productVariant.updateMany(
      {
        where: {
          productId: { in: ids },
        },
        data: {
          isArchived: new Date(),
        },
      },
    );

    return {
      status: true,
      message: `Archived ${archivedProducts.count} product and ${archivedProductVariants.count} related product variants successfully.`,
      archivedProductIds: ids,
      archivedVariantCount: archivedProductVariants.count,
    };
  }
}
