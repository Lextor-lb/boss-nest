import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import {
  RemoveManyProductBrandDto,
  UpdateProductBrandDto,
  CreateProductBrandDto,
  PrismaService,
  MediaDto,
  MediaService,
  ProductBrandEntity,
  MediaEntity,
  SearchOption,
} from 'src';
import { PaginatedProductBrand } from 'src/shared/types/productBrand';
import { createEntityProps } from 'src/shared/utils/createEntityProps';
import { deleteFile } from 'src/shared/utils/deleteOldImageFile';

@Injectable()
export class ProductBrandsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService, // Inject MediaService
  ) {}

  whereCheckingNullClause: Prisma.ProductBrandWhereInput = {
    isArchived: null,
  };

  async create(createProductBrandDto: CreateProductBrandDto) {
    try {
      const { imageFileUrl, ...productBrandData } = createProductBrandDto;

      const productBrand = await this.prisma.$transaction(
        async (transactionClient: PrismaClient) => {
          const mediaDto = new MediaDto();
          mediaDto.url = imageFileUrl;
          const uploadedMedia = await this.mediaService.saveMedia(
            transactionClient,
            mediaDto,
          );

          const productBrand = await transactionClient.productBrand.create({
            data: { ...productBrandData, mediaId: uploadedMedia.id },
          });

          return { ...productBrand, media: uploadedMedia };
        },
      );

      return new ProductBrandEntity({
        ...productBrand,
        media: new MediaEntity(productBrand.media),
      });
    } catch (error) {
      throw new BadRequestException('Failed to create ProductBrand');
    }
  }

  async indexAll(): Promise<ProductBrandEntity[]> {
    const productBrands = await this.prisma.productBrand.findMany({
      where: this.whereCheckingNullClause,
    });
    return productBrands.map(
      (pb) => new ProductBrandEntity(createEntityProps(pb)),
    );
  }

  async findAll({
    page,
    limit,
    search = '',
    orderBy = 'createdAt',
    orderDirection = 'desc',
  }: SearchOption): Promise<PaginatedProductBrand> {
    const total = await this.prisma.productBrand.count({
      where: this.whereCheckingNullClause,
    });
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit);

    const productBrands = await this.prisma.productBrand.findMany({
      where: {
        ...this.whereCheckingNullClause,
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      skip,
      take: limit,
      orderBy: {
        [orderBy]: orderDirection,
      },
      include: {
        media: true,
      },
    });
    const productBrandEntities = productBrands.map((pb) => {
      const { media, ...productBrandData } = pb;
      return new ProductBrandEntity({
        ...productBrandData,
        media: new MediaEntity(media),
      });
    });

    return {
      data: productBrandEntities,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: number): Promise<ProductBrandEntity> {
    const { media, ...productBrandData } =
      await this.prisma.productBrand.findUnique({
        where: { id, AND: this.whereCheckingNullClause },
        include: { media: true },
      });

    return new ProductBrandEntity({
      ...productBrandData,
      media: new MediaEntity(media),
    });
  }

  async update(
    id: number,
    updateProductBrandDto: UpdateProductBrandDto,
  ): Promise<ProductBrandEntity> {
    try {
      const { imageFileUrl, ...productBrandData } = updateProductBrandDto;

      const existingProductBrand = await this.prisma.productBrand.findUnique({
        where: { id, AND: this.whereCheckingNullClause },
        include: { media: true },
      });

      if (!existingProductBrand) {
        throw new NotFoundException(`ProductBrand with id ${id} not found`);
      }

      const oldImageFileUrl = existingProductBrand.media?.url;
      if (imageFileUrl && oldImageFileUrl) {
        deleteFile(oldImageFileUrl);
      }

      const updatedProductBrand = await this.prisma.$transaction(
        async (transactionClient: PrismaClient) => {
          let updatedMedia = existingProductBrand.media;

          if (imageFileUrl) {
            const mediaDto = new MediaDto();
            mediaDto.url = imageFileUrl;
            if (updatedMedia) {
              updatedMedia = await this.mediaService.updateMedia(
                transactionClient,
                updatedMedia.id,
                mediaDto,
              );
            }
          }

          const productBrand = await transactionClient.productBrand.update({
            where: { id },
            data: productBrandData,
          });
          const oldImageFileUrl = existingProductBrand.media?.url;
          if (imageFileUrl && oldImageFileUrl) {
            deleteFile(oldImageFileUrl);
          }
          return { ...productBrand, media: updatedMedia };
        },
      );

      const { media, ...updatedProductBrandData } = updatedProductBrand;

      return new ProductBrandEntity({
        ...updatedProductBrandData,
        media: new MediaEntity(media),
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    await this.prisma.productBrand.update({
      where: { id },
      data: { isArchived: new Date() },
    });
    return {
      status: true,
      message: `Deleted product brand successfully.`,
    };
  }

  async removeMany(removeManyProductBrandDto: RemoveManyProductBrandDto) {
    const { ids } = removeManyProductBrandDto;

    const { count } = await this.prisma.productBrand.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        isArchived: new Date(),
      },
    });

    return {
      status: true,
      message: `Deleted ${count} product brands successfully.`,
      archivedIds: ids,
    };
  }
}
