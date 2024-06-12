import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { ProductCategoryEntity } from './entity/product-category.entity';
import { Prisma } from '@prisma/client';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { RemoveManyProductCategoryDto } from './dto/removeMany-product-category.dto';

@Injectable()
export class ProductCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  whereCheckingNullClause: Prisma.ProductCategoryWhereInput = {
    isArchived: null,
  };

  async create(
    createProductCategoryDto: CreateProductCategoryDto,
    createdByUserId: number,
  ): Promise<ProductCategoryEntity> {
    const { name, productTypeId, productFittingIds } = createProductCategoryDto;

    // Create the ProductCategory entity
    const createdProductCategory = await this.prisma.productCategory.create({
      data: {
        name,
        productTypeId,
        createdByUserId,
      },
    });

    // If productFittingIds are provided, create the associations
    if (productFittingIds) {
      const productCategoryProductFittings = productFittingIds.map(
        (productFittingId) => ({
          productCategoryId: createdProductCategory.id,
          productFittingId,
        }),
      );

      await this.prisma.productCategoryProductFitting.createMany({
        data: productCategoryProductFittings,
      });
    }

    // return createdProductCategory;
    return new ProductCategoryEntity({
      ...createdProductCategory,
      productFittingIds,
      productTypeId,
    });
  }

  async indexAll(): Promise<
    Pick<ProductCategoryEntity, 'id' | 'name' | 'isArchived'>[]
  > {
    return await this.prisma.productCategory.findMany();
  }

  async findAll(
    page: number,
    limit: number,
    searchName?: string,
    orderBy: string = 'createdAt',
    orderDirection: 'asc' | 'desc' = 'desc',
  ) {
    const total = await this.prisma.productCategory.count({
      where: this.whereCheckingNullClause,
    });
    const skip = (page - 1) * limit;

    const productCategories = await this.prisma.productCategory.findMany({
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
        ProductCategoryProductFitting: {
          select: {
            productFittingId: true,
          },
        },
      },
    });

    // Directly transform the result to include productSizingIds and remove the nested ProductFittingProductSizing
    const finalResult = productCategories.map((pf) => {
      const productFittingIds = pf.ProductCategoryProductFitting.map(
        (pfs) => pfs.productFittingId,
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { ProductCategoryProductFitting, ...rest } = pf;
      return { ...rest, productFittingIds };
    });

    return { data: finalResult, total, page, limit };
  }

  findOne(id: number) {
    return this.prisma.productCategory
      .findUnique({
        where: {
          id,
          AND: this.whereCheckingNullClause,
        },
        include: {
          ProductCategoryProductFitting: {
            select: {
              productFittingId: true,
            },
          },
        },
      })
      .then((productCategory) => {
        if (!productCategory) {
          return null;
        }
        const productFittingIds =
          productCategory.ProductCategoryProductFitting.map(
            (pfs) => pfs.productFittingId,
          );
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { ProductCategoryProductFitting, ...rest } = productCategory;
        return { ...rest, productFittingIds };
      });
  }

  async update(
    id: number,
    updateProductCategoryDto: UpdateProductCategoryDto,
  ): Promise<ProductCategoryEntity> {
    const { name, productFittingIds, updatedByUserId, productTypeId } =
      updateProductCategoryDto;

    // Find the existing ProductCategory
    const existingProductCategory =
      await this.prisma.productCategory.findUnique({
        where: { id },
      });

    if (!existingProductCategory) {
      throw new NotFoundException(`ProductCategory with id ${id} not found`);
    }

    // Update the ProductCategory entity
    const updatedProductCategory = await this.prisma.productCategory.update({
      where: { id },
      data: {
        name,
        updatedByUserId,
        productTypeId,
      },
    });

    // If productSizingIds are provided, update the associations
    if (productFittingIds) {
      // Delete existing associations
      await this.prisma.productCategoryProductFitting.deleteMany({
        where: { productCategoryId: id },
      });

      // Create new associations
      const productCategoryProductFittings = productFittingIds.map(
        (productFittingId) => ({
          productCategoryId: id,
          productFittingId,
        }),
      );

      await this.prisma.productCategoryProductFitting.createMany({
        data: productCategoryProductFittings,
      });
    }

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
