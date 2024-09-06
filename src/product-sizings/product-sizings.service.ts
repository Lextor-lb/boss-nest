import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductSizingDto } from './dto/create-product-sizing.dto';
import { Prisma } from '@prisma/client';
import { UpdateProductSizingDto } from './dto/update-product-sizing.dto';
import { RemoveManyProductSizingDto } from './dto/removeMany-product-sizing.dto';
import { ProductSizingEntity } from './entity';
import { SearchOption } from 'src';
import { PaginatedProductSizing } from 'src/shared/types/productSizing';
import { createEntityProps } from 'src/shared/utils/createEntityProps';

@Injectable()
export class ProductSizingsService {
  constructor(private prisma: PrismaService) {}

  whereCheckingNullClause: Prisma.ProductSizingWhereInput = {
    isArchived: null,
  };

  async createMultiple(
    createProductSizingDtos: CreateProductSizingDto[],
  ): Promise<ProductSizingEntity[]> {
    const createdProductSizings = [];

    for (const createProductSizingDto of createProductSizingDtos) {
      const createdProductSizing = await this.prisma.productSizing.create({
        data: {
          ...createProductSizingDto,
        },
      });
      createdProductSizings.push(createdProductSizing);
    }

    return createdProductSizings.map(
      (createdProductSizing) => new ProductSizingEntity(createdProductSizing),
    );
  }

  async indexAll(): Promise<ProductSizingEntity[]> {
    const productSizings = await this.prisma.productSizing.findMany({
      where: this.whereCheckingNullClause,
    });
    return productSizings.map(
      (productSizing) =>
        new ProductSizingEntity(createEntityProps(productSizing)),
    );
  }

  async findAll({
    page,
    limit,
    search = '',
    orderBy = 'createdAt',
    orderDirection = 'desc',
  }: SearchOption): Promise<PaginatedProductSizing> {
    const total = await this.prisma.productSizing.count({
      where: this.whereCheckingNullClause,
    });
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit);

    const productSizings = await this.prisma.productSizing.findMany({
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
      data: productSizings.map(
        (productSizing) => new ProductSizingEntity(productSizing),
      ),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: number): Promise<ProductSizingEntity> {
    const productSizing = await this.prisma.productSizing.findUnique({
      where: { id, AND: this.whereCheckingNullClause },
    });

    return new ProductSizingEntity(productSizing);
  }

  async update(
    id: number,
    updateProductSizingDto: UpdateProductSizingDto,
  ): Promise<ProductSizingEntity> {
    const existingProductSizing = await this.prisma.productSizing.findUnique({
      where: { id, AND: this.whereCheckingNullClause },
    });
    if (!existingProductSizing) {
      throw new NotFoundException(`ProductSizing with id ${id} not found`);
    }

    const productSizing = await this.prisma.productSizing.update({
      where: { id },
      data: updateProductSizingDto,
    });
    return new ProductSizingEntity(productSizing);
  }

  async remove(id: number) {
    await this.prisma.productSizing.update({
      where: { id, AND: this.whereCheckingNullClause },
      data: { isArchived: new Date() },
    });
    return {
      status: true,
      message: `Deleted product sizing successfully.`,
    };
  }

  async removeMany(removeManyProductSizingDto: RemoveManyProductSizingDto) {
    const { ids } = removeManyProductSizingDto;

    const { count } = await this.prisma.productSizing.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        isArchived: new Date(),
      },
    });

    return {
      status: true,
      message: `Deleted ${count} product sizings successfully.`,
      archivedIds: ids,
    };
  }
}
