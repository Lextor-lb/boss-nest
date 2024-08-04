import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { MediaService } from 'src/media/media.service';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { ProductVariantEntity } from './entity/product-variant.entity';
import { MediaEntity } from 'src/media/entity/media.entity';
import { MediaDto } from 'src/media/dto/media.dto';
import { PrismaService } from 'src/prisma';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { deleteFile } from 'src/shared/utils/deleteOldImageFile';
import { RemoveManyProductVariantDto } from './dto/removeMany-product-variant.dto';
import { ProductSizingEntity } from 'src/product-sizings/entity/product-sizing.entity';
import { createEntityProps } from 'src/shared/utils/createEntityProps';

@Injectable()
export class ProductVariantsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService, // Inject MediaService
  ) {}
  whereCheckingNullClause: Prisma.ProductVariantWhereInput = {
    isArchived: null,
    statusStock: null,
  };

  async create(createProductVariantDto: CreateProductVariantDto) {
    try {
      const { imageFileUrl, ...variantData } = createProductVariantDto;

      const productVariant = await this.prisma.$transaction(
        async (transactionClient: PrismaClient) => {
          const mediaDto = new MediaDto();
          mediaDto.url = imageFileUrl;
          const uploadedMedia = await this.mediaService.saveMedia(
            transactionClient,
            mediaDto,
          );

          const productVariant = await transactionClient.productVariant.create({
            data: { ...variantData, mediaId: uploadedMedia.id },
          });

          return { ...productVariant, media: uploadedMedia };
        },
      );
      return new ProductVariantEntity({
        ...productVariant,
        media: new MediaEntity(productVariant.media),
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error creating product variant');
    }
  }

  async createWithTransaction(
    transactionClient: PrismaClient,
    createProductVariantDto: CreateProductVariantDto,
  ) {
    try {
      const { imageFileUrl, ...variantData } = createProductVariantDto;

      const mediaDto = new MediaDto();
      mediaDto.url = imageFileUrl;
      const uploadedMedia = await this.mediaService.saveMedia(
        transactionClient,
        mediaDto,
      );

      const productVariant = await transactionClient.productVariant.create({
        data: { ...variantData, mediaId: uploadedMedia.id },
      });

      return productVariant;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error creating product variant');
    }
  }

  async update(
    id: number,
    updateProductVariantDto: UpdateProductVariantDto,
  ): Promise<any> {
    try {
      const { imageFileUrl, ...variantData } = updateProductVariantDto;

      const existingVariant = await this.prisma.productVariant.findUnique({
        where: { id, AND: this.whereCheckingNullClause },
        include: { media: true },
      });

      if (!existingVariant) {
        throw new BadRequestException('Product variant not found');
      }

      await this.prisma.$transaction(
        async (transactionClient: PrismaClient) => {
          if (imageFileUrl) {
            const mediaDto = new MediaDto();
            mediaDto.url = imageFileUrl;
            await this.mediaService.updateMedia(
              transactionClient,
              existingVariant.mediaId,
              mediaDto,
            );
          }
          await transactionClient.productVariant.update({
            where: { id, AND: this.whereCheckingNullClause },
            data: variantData,
          });
        },
      );
      const oldImageFileUrl = existingVariant.media?.url;
      if (imageFileUrl && oldImageFileUrl) {
        deleteFile(oldImageFileUrl);
      }
      const { media, productSizing, ...updatedVariant } =
        await this.prisma.productVariant.findUnique({
          where: { id },
          include: { productSizing: true, media: true },
        });

      return {
        status: true,
        message: 'Updated Successfully!',
        data: new ProductVariantEntity({
          ...updatedVariant,
          media: new MediaEntity(media),
          productSizing: new ProductSizingEntity(
            createEntityProps(productSizing),
          ),
        }),
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error updating product variant');
    }
  }

  async remove(id: number) {
    await this.prisma.productVariant.update({
      where: { id },
      data: { isArchived: new Date() },
    });
    return {
      status: true,
      message: `Deleted product variant successfully.`,
    };
  }

  async removeMany(removeManyProductSizingDto: RemoveManyProductVariantDto) {
    const { ids } = removeManyProductSizingDto;

    const { count } = await this.prisma.productVariant.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        isArchived: new Date(),
      },
    });

    return {
      status: true,
      message: `Deleted ${count} product variants successfully.`,
      archivedIds: ids,
    };
  }
  async countAvailableStock(): Promise<number> {
    return this.prisma.productVariant.count({
      where: {
        isArchived: null,
        statusStock: null,
      },
    });
  }
}
