/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductFittingEntity } from './entity/product-fitting.entity';
import {} from './dto/update-product-fitting.dto';
import { RemoveManyProductFittingDto } from './dto/removeMany-product-fitting.dto';
import {
  CreateProductFittingDto,
  SearchOption,
  UpdateProductFittingDto,
} from 'src';
import { instanceToPlain } from 'class-transformer';
import { PaginatedProductFitting } from 'src/shared/types/productFitting';

@Injectable()
export class ProductFittingsService {
  constructor(private prisma: PrismaService) {}

  whereCheckingNullClause: Prisma.ProductFittingWhereInput = {
    isArchived: null,
  };

  async create(
    createProductFittingDto: CreateProductFittingDto,
  ): Promise<ProductFittingEntity> {
    const { name, productSizingIds } = createProductFittingDto;

    // Create the ProductFitting entity
    const createdProductFitting = await this.prisma.productFitting.create({
      data: {
        name,
      },
    });

    // If productSizingIds are provided, create the associations
    if (productSizingIds) {
      const productFittingProductSizings = productSizingIds.map(
        (productSizingId) => ({
          productFittingId: createdProductFitting.id,
          productSizingId,
        }),
      );

      await this.prisma.productFittingProductSizing.createMany({
        data: productFittingProductSizings,
      });
    }

    const createdProductSizingIds = await this.getProductSizingIds(
      createdProductFitting.id,
    );

    // Return the created ProductFitting as a ProductFittingEntity with productSizingIds
    return new ProductFittingEntity({
      ...createdProductFitting,
      productSizingIds: createdProductSizingIds,
    });
  }

  async indexAll(): Promise<ProductFittingEntity[]> {
    const productFittings = await this.prisma.productFitting.findMany({
      select: {
        id: true,
        name: true,
        isArchived: true,
      },
    });
    return productFittings.map(
      (productFitting) => new ProductFittingEntity(productFitting),
    );
  }

  async findAll({
    page,
    limit,
    search = '',
    orderBy = 'createdAt',
    orderDirection = 'desc',
  }: SearchOption): Promise<PaginatedProductFitting> {
    const total = await this.prisma.productFitting.count({
      where: this.whereCheckingNullClause,
    });
    const skip = (page - 1) * limit;

    const productFittings = await this.prisma.productFitting.findMany({
      where: {
        ...this.whereCheckingNullClause,
        name: {
          contains: search || '',
        },
      },
      skip,
      take: limit,
      orderBy: {
        [orderBy]: orderDirection,
      },
      include: {
        ProductFittingProductSizing: {
          select: {
            productSizingId: true,
          },
        },
      },
    });

    // Directly transform the result to include productSizingIds and remove the nested ProductFittingProductSizing
    const productFittingEntities = productFittings.map((productFitting) => {
      const { ProductFittingProductSizing, ...productFittingData } =
        productFitting;
      const productSizingIds = productFitting.ProductFittingProductSizing.map(
        (pfs) => pfs.productSizingId,
      );
      return new ProductFittingEntity({
        ...productFittingData,
        productSizingIds,
      });
    });

    return { data: productFittingEntities, total, page, limit };
  }

  findOne(id: number) {
    return this.prisma.productFitting
      .findUnique({
        where: {
          id,
          AND: this.whereCheckingNullClause,
        },
        include: {
          ProductFittingProductSizing: {
            select: {
              productSizingId: true,
            },
          },
        },
      })
      .then((productFitting) => {
        if (!productFitting) {
          return null;
        }
        const productSizingIds = productFitting.ProductFittingProductSizing.map(
          (pfs) => pfs.productSizingId,
        );
        const { ProductFittingProductSizing, ...rest } = productFitting;
        return { ...rest, productSizingIds };
      });
  }

  async update(
    id: number,
    updateProductFittingDto: UpdateProductFittingDto,
    updatedByUserId: number,
  ): Promise<ProductFittingEntity> {
    const { name, productSizingIds } = updateProductFittingDto;

    // Find the existing ProductFitting
    const existingProductFitting = await this.prisma.productFitting.findUnique({
      where: { id },
    });

    if (!existingProductFitting) {
      throw new NotFoundException(`ProductFitting with id ${id} not found`);
    }

    // Update the ProductFitting entity
    const updatedProductFitting = await this.prisma.productFitting.update({
      where: { id },
      data: {
        name,
        updatedByUserId,
      },
    });

    // If productSizingIds are provided, update the associations
    if (productSizingIds) {
      // Delete existing associations
      await this.prisma.productFittingProductSizing.deleteMany({
        where: { productFittingId: id },
      });

      // Create new associations
      const productFittingProductSizings = productSizingIds.map(
        (productSizingId) => ({
          productFittingId: id,
          productSizingId,
        }),
      );

      await this.prisma.productFittingProductSizing.createMany({
        data: productFittingProductSizings,
      });
    }

    const updatedProductSizingIds = await this.getProductSizingIds(id);

    // Return the updated ProductFitting as a ProductFittingEntity with productSizingIds
    return new ProductFittingEntity({
      ...updatedProductFitting,
      productSizingIds: updatedProductSizingIds,
    });
  }

  async removeMany(removeManyProductFittingDto: RemoveManyProductFittingDto) {
    const { ids } = removeManyProductFittingDto;

    const { count } = await this.prisma.productFitting.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        isArchived: new Date(),
      },
    });

    return {
      status: true,
      message: `Deleted ${count} product fittings successfully.`,
      archivedIds: ids,
    };
  }

  private async getProductSizingIds(
    productFittingId: number,
  ): Promise<number[]> {
    const associatedProductSizings =
      await this.prisma.productFittingProductSizing.findMany({
        where: { productFittingId },
        select: { productSizingId: true },
      });

    return associatedProductSizings.map(
      (association) => association.productSizingId,
    );
  }
}
