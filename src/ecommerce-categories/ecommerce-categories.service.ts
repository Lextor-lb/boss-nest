import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEcommerceCategoryDto } from './dto/create-ecommerce-category.dto';
import { UpdateEcommerceCategoryDto } from './dto/update-ecommerce-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MediaService } from 'src/media/media.service';
import { Prisma, PrismaClient } from '@prisma/client';
import { MediaDto } from 'src/media/dto/media.dto';
import { EcommerceCategoryEntity } from './entities/ecommerce-category.entity';
import { ProductCategoryEntity } from 'src/product-categories';
import { createEntityProps } from 'src/shared/utils/createEntityProps';
import { MediaEntity } from 'src/media';
import { deleteFile } from 'src/shared/utils/deleteOldImageFile';
import { RemoveManyEcommerceCategoryDto } from './dto/removeMany-commerce-category.dto';

@Injectable()
export class EcommerceCategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) {}

  whereCheckingNullClause: Prisma.EcommerceCategoryWhereInput = {
    isArchived: null,
  };

  async create(createEcommerceCategoryDto: CreateEcommerceCategoryDto) {
    try {
      const { imageFileUrl, ...ecommerceCategoryData } =
        createEcommerceCategoryDto;

      await this.prisma.$transaction(
        async (transactionClient: PrismaClient) => {
          const uploadedMedia = await this.saveImageFile(
            transactionClient,
            imageFileUrl,
          );
          await this.createEcommerceCategory(
            transactionClient,
            ecommerceCategoryData,
            uploadedMedia.id,
          );
        },
      );

      return {
        status: true,
        message: 'Created Successfully!',
      };
    } catch (error) {
      throw new BadRequestException('Failed to create EcommerceCategory');
    }
  }

  private async saveImageFile(
    transactionClient: PrismaClient,
    imageFileUrl: string,
  ): Promise<any> {
    const mediaDto = new MediaDto();
    mediaDto.url = imageFileUrl;
    return await this.mediaService.saveMedia(transactionClient, mediaDto);
  }

  private async createEcommerceCategory(
    transactionClient: PrismaClient,
    ecommerceCategoryData: any,
    mediaId: number,
  ) {
    await transactionClient.ecommerceCategory.create({
      data: { ...ecommerceCategoryData, mediaId },
    });
  }

  async findAll(): Promise<EcommerceCategoryEntity[]> {
    const ecommerceCategories = await this.prisma.ecommerceCategory.findMany({
      where: this.whereCheckingNullClause,
      include: { productCategory: true, media: true },
    });

    return ecommerceCategories.map((ec) => this.transformEcommerceCategory(ec));
  }

  private transformEcommerceCategory(ec: any): EcommerceCategoryEntity {
    const { productCategory, media, ...ecommerceCategory } = ec;

    return new EcommerceCategoryEntity({
      ...ecommerceCategory,
      productCategory: this.transformProductCategory(productCategory),
      media: this.transformMedia(media),
    });
  }

  private transformProductCategory(
    productCategory: ProductCategoryEntity,
  ): ProductCategoryEntity {
    return new ProductCategoryEntity(createEntityProps(productCategory));
  }

  private transformMedia(media: MediaEntity): MediaEntity {
    return new MediaEntity(media);
  }

  async findOne(id: number): Promise<EcommerceCategoryEntity> {
    const ecommerceCategory = await this.prisma.ecommerceCategory.findUnique({
      where: { id },
      include: { productCategory: true, media: true },
    });

    return this.transformEcommerceCategory(ecommerceCategory);
  }

  async update(
    id: number,
    updateEcommerceCategoryDto: UpdateEcommerceCategoryDto,
  ) {
    try {
      const { imageFileUrl, ...ecommerceCategoryData } =
        updateEcommerceCategoryDto;
      const existingEcommerceCategory =
        await this.prisma.ecommerceCategory.findUnique({
          where: { id, AND: this.whereCheckingNullClause },
          include: { media: true },
        });

      await this.prisma.$transaction(
        async (transactionClient: PrismaClient) => {
          if (imageFileUrl) {
            const mediaDto = new MediaDto();
            mediaDto.url = imageFileUrl;
            await this.mediaService.updateMedia(
              transactionClient,
              existingEcommerceCategory.mediaId,
              mediaDto,
            );
          }
          await transactionClient.ecommerceCategory.update({
            where: { id, AND: this.whereCheckingNullClause },
            data: ecommerceCategoryData,
          });
        },
      );
      const oldImageFileUrl = existingEcommerceCategory.media?.url;
      if (imageFileUrl && oldImageFileUrl) {
        deleteFile(oldImageFileUrl);
      }

      return {
        status: true,
        message: 'Updated Successfully!',
      };
    } catch (error) {
      throw new BadRequestException('Error updating ecommerce category');
    }
  }

  async remove(id: number) {
    await this.prisma.ecommerceCategory.update({
      where: { id, AND: this.whereCheckingNullClause },
      data: { isArchived: new Date() },
    });
    return {
      status: true,
      message: `Deleted ecommerce category successfully.`,
    };
  }

  async removeMany(
    removeManyEcommerceCategoryDto: RemoveManyEcommerceCategoryDto,
  ) {
    const { ids } = removeManyEcommerceCategoryDto;

    const { count } = await this.prisma.ecommerceCategory.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        isArchived: new Date(),
      },
    });

    return {
      status: true,
      message: `Deleted ${count} ecommerce categories successfully.`,
      archivedIds: ids,
    };
  }
}
