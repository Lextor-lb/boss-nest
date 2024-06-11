import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductBrandDto } from './dto/create-product-brand.dto';
import { Prisma } from '@prisma/client';
import { UpdateProductBrandDto } from './dto/update-product-brand.dto';
import { unlinkSync } from 'fs';
import { join } from 'path';
import { RemoveManyProductBrandDto } from './dto/removeMany-product-brand.dto';

@Injectable()
export class ProductBrandsService {
  constructor(private readonly prisma: PrismaService) {}

  whereCheckingNullClause: Prisma.ProductBrandWhereInput = {
    isArchived: null,
  };

  async create(
    createProductBrandDto: CreateProductBrandDto,
    filename: string,
    createdBy: number,
  ) {
    const createdMedia = await this.prisma.media.create({
      data: {
        url: `/uploads/brands/${filename}`,
        createdBy,
        updatedBy: createdBy,
      },
    });

    return this.prisma.productBrand.create({
      data: {
        name: createProductBrandDto.name,
        mediaId: createdMedia.id,
        createdBy,
        updatedBy: createdBy,
      },
    });
  }

  async indexAll() {
    return await this.prisma.productBrand.findMany();
  }

  async findAll(
    page: number,
    limit: number,
    searchName?: string,
    orderBy: string = 'createdAt',
    orderDirection: 'asc' | 'desc' = 'desc',
  ) {
    const total = await this.prisma.productBrand.count({
      where: this.whereCheckingNullClause,
    });
    const skip = (page - 1) * limit;

    const productBrands = await this.prisma.productBrand.findMany({
      where: {
        ...this.whereCheckingNullClause,
        name: {
          contains: searchName || '',
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
    return { data: productBrands, total, page, limit };
  }

  findOne(id: number) {
    return this.prisma.productBrand.findUnique({
      where: { id, AND: this.whereCheckingNullClause },
    });
  }

  async update(
    id: number,
    updateProductBrandDto: UpdateProductBrandDto,
    filename: string | null,
    updatedBy: number,
  ) {
    const productBrand = await this.prisma.productBrand.findUnique({
      where: { id, AND: this.whereCheckingNullClause },
      include: { media: true },
    });

    if (!productBrand) {
      return null;
    }

    let mediaId = productBrand.mediaId;

    if (filename) {
      // Remove old image if it exists
      if (productBrand.media?.url) {
        const oldImagePath = join(
          __dirname,
          '..',
          '..',
          '..',
          'uploads',
          'brands',
          productBrand.media.url.split('/').pop(),
        );
        try {
          unlinkSync(oldImagePath);
        } catch (err) {
          console.error('Error deleting old image:', err);
        }
      }

      const mediaData = {
        url: `/uploads/brands/${filename}`,
        updatedBy,
      };

      if (mediaId) {
        await this.prisma.media.update({
          where: { id: mediaId },
          data: mediaData,
        });
      } else {
        const createdMedia = await this.prisma.media.create({
          data: {
            ...mediaData,
            createdBy: updatedBy,
          },
        });
        mediaId = createdMedia.id;
      }
    }

    return this.prisma.productBrand.update({
      where: { id },
      data: {
        ...updateProductBrandDto,
        mediaId,
        updatedBy,
      },
      include: {
        media: true,
      },
    });
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
//commit
