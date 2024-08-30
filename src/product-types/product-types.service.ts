import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';
import { RemoveManyProductTypeDto } from './dto/removeMany-product-type.dto';
import { ProductTypeEntity } from './entity';
import { SearchOption } from 'src';
import { PaginatedProductType } from 'src/shared/types/productType';
import { createEntityProps } from 'src/shared/utils/createEntityProps';
import { ProductCategoryEntity } from 'src/product-categories/entity/product-category.entity';
import { ProductFittingEntity } from 'src/product-fittings/entity/product-fitting.entity';

@Injectable()
export class ProductTypesService {
  constructor(private prisma: PrismaService) {}

  whereCheckingNullClause: Prisma.ProductTypeWhereInput = {
    isArchived: null,
  };

  async create(
    createProductTypeDto: CreateProductTypeDto,
  ): Promise<ProductTypeEntity> {
    try {
      const productType = await this.prisma.productType.create({
        data: createProductTypeDto,
      });
      return new ProductTypeEntity(productType);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create ProductType');
    }
  }

  async indexAll(): Promise<any[]> {
    const productTypes = await this.prisma.productType.findMany({
      where: this.whereCheckingNullClause,
      select: {
        id: true,
        name: true,
        productCategories: {
          select: {
            id: true,
            name: true,
            ProductCategoryProductFitting: {
              select: {
                productFitting: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
    });
    return productTypes.map((pt) => {
      const { productCategories, ...productTypeData } = pt;
      return new ProductTypeEntity({
        ...productTypeData,
        productCategories: productCategories.map((pc) => {
          const productCategoryData = createEntityProps(pc);
          const productFittings = pc.ProductCategoryProductFitting.map(
            (pcpf) => pcpf.productFitting,
          );

          return new ProductCategoryEntity({
            ...productCategoryData,
            productFittings: productFittings.map(
              (pf) => new ProductFittingEntity(createEntityProps(pf)),
            ),
          });
        }),
      });
    });
  }

  async indexAllEcommerce(): Promise<any[]> {
    const productTypes = await this.prisma.productType.findMany({
      where: this.whereCheckingNullClause,
    });
    return productTypes.map(
      (pt) => new ProductTypeEntity(createEntityProps(pt)),
    );
  }

  async findAll({
    page,
    limit,
    search = '',
    orderBy = 'createdAt',
    orderDirection = 'desc',
  }: SearchOption): Promise<PaginatedProductType> {
    const total = await this.prisma.productType.count({
      where: this.whereCheckingNullClause,
    });
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit);

    const productTypes = await this.prisma.productType.findMany({
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
    });
    return {
      data: productTypes.map((pt) => new ProductTypeEntity(pt)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: number): Promise<ProductTypeEntity> {
    const productType = await this.prisma.productType.findUnique({
      where: { id, AND: this.whereCheckingNullClause },
    });

    return new ProductTypeEntity(productType);
  }

  async update(
    id: number,
    updateProductTypeDto: UpdateProductTypeDto,
  ): Promise<ProductTypeEntity> {
    const existingProductType = await this.prisma.productType.findUnique({
      where: { id, AND: this.whereCheckingNullClause },
    });

    if (!existingProductType) {
      throw new NotFoundException(`Product type with ID ${id} not found`);
    }
    const productType = await this.prisma.productType.update({
      where: { id },
      data: updateProductTypeDto,
    });
    return new ProductTypeEntity(productType);
  }

  async remove(id: number) {
    await this.prisma.productType.update({
      where: { id },
      data: { isArchived: new Date() },
    });
    await this.prisma.productCategory.updateMany({
      where: { productTypeId: id },
      data: { isArchived: new Date() },
    });

    return {
      status: true,
      message: `Deleted product type successfully.`,
    };
  }

  async removeMany(removeManyProductTypeDto: RemoveManyProductTypeDto) {
    const { ids } = removeManyProductTypeDto;

    // Archive the ProductType instances
    const archivedProductTypes = await this.prisma.productType.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        isArchived: new Date(),
      },
    });

    // Archive the related ProductCategory instances
    const archivedProductCategories =
      await this.prisma.productCategory.updateMany({
        where: {
          productTypeId: { in: ids },
        },
        data: {
          isArchived: new Date(),
        },
      });

    return {
      status: true,
      message: `Archived ${archivedProductTypes.count} product types and ${archivedProductCategories.count} related product categories successfully.`,
      archivedTypeIds: ids,
      archivedCategoryCount: archivedProductCategories.count,
    };
  }
}
