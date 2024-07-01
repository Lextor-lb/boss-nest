/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductFittingEntity } from './entity/product-fitting.entity';
import { RemoveManyProductFittingDto } from './dto/removeMany-product-fitting.dto';
import { ProductSizingEntity } from '../product-sizings/entity';
import {
  CreateProductFittingDto,
  // ProductSizingEntity,
  SearchOption,
  UpdateProductFittingDto,
} from 'src';
import { PaginatedProductFitting } from 'src/shared/types/productFitting';
import { createEntityProps } from 'src/shared/utils/createEntityProps';

@Injectable()
export class ProductFittingsService {
  constructor(private prisma: PrismaService) {}

  whereCheckingNullClause: Prisma.ProductFittingWhereInput = {
    isArchived: null,
  };

  async create(
    createProductFittingDto: CreateProductFittingDto,
  ): Promise<ProductFittingEntity> {
    try {
      const { name, productSizingIds } = createProductFittingDto;

      // Start a transaction
      const createdProductFitting = await this.prisma.$transaction(
        async (prisma) => {
          // Create the ProductFitting entity
          const createdProductFitting = await prisma.productFitting.create({
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

            await prisma.productFittingProductSizing.createMany({
              data: productFittingProductSizings,
            });
          }

          return createdProductFitting;
        },
      );

      const createdProductSizingIds = await this.getProductSizingIds(
        createdProductFitting.id,
      );

      // Return the created ProductFitting as a ProductFittingEntity with productSizingIds
      return new ProductFittingEntity({
        ...createdProductFitting,
        productSizingIds: createdProductSizingIds,
      });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create ProductFitting'); // Adjust error handling as per your application's requirements
    }
  }
  async indexAll(): Promise<ProductFittingEntity[]> {
    const productFittings = await this.prisma.productFitting.findMany({
      where: this.whereCheckingNullClause,
    });
    return productFittings.map(
      (productFitting) =>
        new ProductFittingEntity(createEntityProps(productFitting)),
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
    const totalPages = Math.ceil(total / limit);

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
            productSizing: true,
          },
        },
      },
    });

    const productFittingEntities = productFittings.map((productFitting) => {
      const { ProductFittingProductSizing, ...productFittingData } =
        productFitting;
      const productSizings = ProductFittingProductSizing.map(
        (pfs) => pfs.productSizing,
      );
      return new ProductFittingEntity({
        ...productFittingData,
        productSizings: productSizings.map(
          (productSizing) =>
            new ProductSizingEntity(createEntityProps(productSizing)),
        ),
      });
    });

    return { data: productFittingEntities, total, page, limit, totalPages };
  }

  async findOne(id: number): Promise<ProductFittingEntity> {
    const productFitting = await this.prisma.productFitting.findUnique({
      where: {
        id,
        AND: this.whereCheckingNullClause,
      },
      include: {
        ProductFittingProductSizing: { select: { productSizing: true } },
      },
    });
    if (!productFitting) {
      throw new NotFoundException(`ProductFitting with ID ${id} not found.`);
    }

    const { ProductFittingProductSizing, ...productFittingData } =
      productFitting;
    const productSizings = ProductFittingProductSizing.map(
      (pfs) => pfs.productSizing,
    );
    return new ProductFittingEntity({
      ...productFittingData,
      productSizings: productSizings.map(
        (productSizing) =>
          new ProductSizingEntity(createEntityProps(productSizing)),
      ),
    });
  }

  async update(
    updateProductFittingDto: UpdateProductFittingDto,
  ): Promise<ProductFittingEntity> {
    const { productSizingIds, id, ...productFittingData } =
      updateProductFittingDto;

    const updatedProductFitting = await this.prisma.$transaction(
      async (prisma) => {
        // Find the existing ProductFitting
        const existingProductFitting = await prisma.productFitting.findUnique({
          where: { id, AND: this.whereCheckingNullClause },
        });

        if (!existingProductFitting) {
          throw new NotFoundException(`ProductFitting with id ${id} not found`);
        }

        // Update the ProductFitting entity
        const updatedProductFitting = await prisma.productFitting.update({
          where: { id },
          data: productFittingData,
        });

        // If productSizingIds are provided, update the associations
        if (productSizingIds) {
          // Delete existing associations
          await prisma.productFittingProductSizing.deleteMany({
            where: { productFittingId: id },
          });

          // Create new associations
          const productFittingProductSizings = productSizingIds.map(
            (productSizingId) => ({
              productFittingId: id,
              productSizingId,
            }),
          );

          await prisma.productFittingProductSizing.createMany({
            data: productFittingProductSizings,
          });
        }

        return updatedProductFitting;
      },
    );

    const updatedProductSizingIds = await this.getProductSizingIds(id);

    // Return the updated ProductFitting as a ProductFittingEntity with productSizingIds
    return new ProductFittingEntity({
      ...updatedProductFitting,
      productSizingIds: updatedProductSizingIds,
    });
  }
  async remove(id: number) {
    await this.prisma.productFitting.update({
      where: { id },
      data: { isArchived: new Date() },
    });
    return {
      status: true,
      message: `Deleted product fitting successfully.`,
    };
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
