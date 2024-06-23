import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  ProductCategoryEntity,
  RemoveManyProductCategoryDto,
  UpdateProductCategoryDto,
  CreateProductCategoryDto,
  SearchOption,
  ProductFittingEntity,
  ProductTypeEntity,
  // PrismaService,
} from 'src';
import { PaginatedProductCategory } from 'src/shared/types/productCategory';
import { createEntityProps } from 'src/shared/utils/createEntityProps';

@Injectable()
export class ProductCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  whereCheckingNullClause: Prisma.ProductCategoryWhereInput = {
    isArchived: null,
  };

  async create(
    createProductCategoryDto: CreateProductCategoryDto,
  ): Promise<ProductCategoryEntity> {
    const { productFittingIds, ...productCategoryData } =
      createProductCategoryDto;

    try {
      const createdProductCategory = await this.prisma.$transaction(
        async (prisma) => {
          // Create the ProductCategory entity
          const createdProductCategory = await prisma.productCategory.create({
            data: productCategoryData,
          });

          // If productFittingIds are provided, create the associations
          if (productFittingIds) {
            const productCategoryProductFittings = productFittingIds.map(
              (productFittingId) => ({
                productCategoryId: createdProductCategory.id,
                productFittingId,
              }),
            );

            await prisma.productCategoryProductFitting.createMany({
              data: productCategoryProductFittings,
            });
          }

          return createdProductCategory;
        },
      );

      return new ProductCategoryEntity({
        ...createdProductCategory,
        productFittingIds,
      });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create ProductCategory'); // Adjust error handling as per your application's requirements
    }
  }

  async indexAll(): Promise<ProductCategoryEntity[]> {
    const productCategories = await this.prisma.productCategory.findMany();
    return productCategories.map(
      (productCategory) =>
        new ProductCategoryEntity(createEntityProps(productCategory)),
    );
  }

  async findAll({
    page,
    limit,
    search = '',
    orderBy = 'createdAt',
    orderDirection = 'desc',
  }: SearchOption): Promise<PaginatedProductCategory> {
    const total = await this.prisma.productCategory.count({
      where: this.whereCheckingNullClause,
    });
    const skip = (page - 1) * limit;

    const productCategories = await this.prisma.productCategory.findMany({
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
        productType: true,
        ProductCategoryProductFitting: {
          select: {
            productFitting: true,
          },
        },
      },
    });

    // Directly transform the result to include productSizingIds and remove the nested ProductFittingProductSizing
    const productCategoryEntities = productCategories.map((productCategory) => {
      const {
        ProductCategoryProductFitting,
        productType,
        ...productCategoryData
      } = productCategory;
      const productFittings = ProductCategoryProductFitting.map(
        (pcf) => pcf.productFitting,
      );
      return new ProductCategoryEntity({
        ...productCategoryData,
        productType: new ProductTypeEntity(createEntityProps(productType)),
        productFittings: productFittings.map(
          (productFitting) =>
            new ProductFittingEntity(createEntityProps(productFitting)),
        ),
      });
    });

    return { data: productCategoryEntities, total, page, limit };
  }

  async findOne(id: number) {
    const productCategory = await this.prisma.productCategory.findUnique({
      where: {
        id,
        AND: this.whereCheckingNullClause,
      },
      include: {
        ProductCategoryProductFitting: {
          select: {
            productFitting: true,
          },
        },
      },
    });

    if (!productCategory) {
      throw new NotFoundException(`productCategory with ID ${id} not found.`);
    }

    const { ProductCategoryProductFitting, ...productFittingData } =
      productCategory;
    const productFittings = ProductCategoryProductFitting.map(
      (pcf) => pcf.productFitting,
    );

    return new ProductCategoryEntity({
      ...productFittingData,
      productFittings: productFittings.map(
        (productFitting) =>
          new ProductFittingEntity(createEntityProps(productFitting)),
      ),
    });
  }

  async update(
    id: number,
    updateProductCategoryDto: UpdateProductCategoryDto,
  ): Promise<ProductCategoryEntity> {
    const { productFittingIds, ...productCategoryData } =
      updateProductCategoryDto;

    // Perform the update operation within a transaction
    const updatedProductCategory = await this.prisma.$transaction(
      async (prisma) => {
        // Find the existing ProductCategory
        const existingProductCategory = await prisma.productCategory.findUnique(
          {
            where: { id, AND: this.whereCheckingNullClause },
          },
        );

        if (!existingProductCategory) {
          throw new NotFoundException(
            `ProductCategory with id ${id} not found`,
          );
        }

        // Update the ProductCategory entity
        const updatedProductCategory = await prisma.productCategory.update({
          where: { id },
          data: productCategoryData,
        });

        // If productFittingIds are provided, update the associations
        if (productFittingIds) {
          // Delete existing associations
          await prisma.productCategoryProductFitting.deleteMany({
            where: { productCategoryId: id },
          });

          // Create new associations
          const productCategoryProductFittings = productFittingIds.map(
            (productFittingId) => ({
              productCategoryId: id,
              productFittingId,
            }),
          );

          await prisma.productCategoryProductFitting.createMany({
            data: productCategoryProductFittings,
          });
        }

        return updatedProductCategory;
      },
    );

    const updatedProductFittingIds = await this.getProductFittingIds(id);

    return new ProductCategoryEntity({
      ...updatedProductCategory,
      productFittingIds: updatedProductFittingIds,
    });
  }

  private async getProductFittingIds(
    productCategoryId: number,
  ): Promise<number[]> {
    const associatedProductFittings =
      await this.prisma.productCategoryProductFitting.findMany({
        where: { productCategoryId },
        select: { productFittingId: true },
      });

    return associatedProductFittings.map(
      (association) => association.productFittingId,
    );
  }

  async removeMany(removeManyProductCategoryDto: RemoveManyProductCategoryDto) {
    const { ids } = removeManyProductCategoryDto;

    const { count } = await this.prisma.productCategory.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        isArchived: new Date(),
      },
    });

    return {
      status: true,
      message: `Deleted ${count} product categories successfully.`,
      archivedIds: ids,
    };
  }
}
