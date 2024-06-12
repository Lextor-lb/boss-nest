import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';
import { RemoveManyProductTypeDto } from './dto/removeMany-product-type.dto';

@Injectable()
export class ProductTypesService {
  constructor(private prisma: PrismaService) {}

  whereCheckingNullClause: Prisma.ProductTypeWhereInput = {
    isArchived: null,
  };

  create(createProductTypeDto: CreateProductTypeDto) {
    return this.prisma.productType.create({ data: createProductTypeDto });
  }

  async indexAll() {
    return await this.prisma.productType.findMany();
  }

  async findAll(
    page: number,
    limit: number,
    searchName?: string,
    orderBy: string = 'createdAt',
    orderDirection: 'asc' | 'desc' = 'desc',
  ) {
    const total = await this.prisma.productType.count({
      where: this.whereCheckingNullClause,
    });
    const skip = (page - 1) * limit;

    const productTypes = await this.prisma.productType.findMany({
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
    });
    return { data: productTypes, total, page, limit };
  }

  findOne(id: number) {
    return this.prisma.productType.findUnique({
      where: { id, AND: this.whereCheckingNullClause },
    });
  }

  async update(id: number, updateProductTypeDto: UpdateProductTypeDto) {
    const existingProductType = await this.prisma.productType.findUnique({
      where: { id, AND: this.whereCheckingNullClause },
    });

    if (!existingProductType) {
      throw new NotFoundException(`Product type with ID ${id} not found`);
    }
    return this.prisma.productType.update({
      where: { id },
      data: updateProductTypeDto,
    });
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
