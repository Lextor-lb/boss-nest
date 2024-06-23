import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';
import { RemoveManyProductTypeDto } from './dto/removeMany-product-type.dto';
import { ProductTypeEntity } from './entity';
import { createEntityProps } from 'src/shared/utils/createEntityProps';
import { SearchOption } from 'src';
import { PaginatedProductType } from 'src/shared/types/productType';
// import { PrismaService } from 'src';
//
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
      throw new Error('Failed to create ProductType'); // Adjust error handling as per your application's requirements
    }
  }

  async indexAll(): Promise<ProductTypeEntity[]> {
    const productTypes = await this.prisma.productType.findMany();
    return productTypes.map(
      (productType) => new ProductTypeEntity(createEntityProps(productType)),
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

    const productTypes = await this.prisma.productType.findMany({
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
    });
    return {
      data: productTypes.map((pt) => new ProductTypeEntity(pt)),
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<ProductTypeEntity> {
    const productType = await this.prisma.productType.findUnique({
      where: { id, AND: this.whereCheckingNullClause },
    });
    if (!productType) {
      throw new NotFoundException(`productType with ID ${id} not found.`);
    }
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
