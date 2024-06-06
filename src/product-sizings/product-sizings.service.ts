import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductSizingDto } from './dto/create-product-sizing.dto';
import { Prisma } from '@prisma/client';
import { UpdateProductSizingDto } from './dto/update-product-sizing.dto';
import { RemoveManyProductSizingDto } from './dto/removeMany-product-sizing.dto';

@Injectable()
export class ProductSizingsService {
  constructor(private prisma: PrismaService) {}

  whereCheckingNullClause: Prisma.ProductSizingWhereInput = {
    isArchived: null,
  };

  // create(createProductSizingDto: CreateProductSizingDto) {
  //   return this.prisma.productSizing.create({ data: createProductSizingDto });
  // }
  async createMultiple(createProductSizingDtos: CreateProductSizingDto[]) {
    const createdProductSizings = [];

    for (const createProductSizingDto of createProductSizingDtos) {
      const createdProductSizing = await this.prisma.productSizing.create({
        data: {
          ...createProductSizingDto,
        },
      });
      createdProductSizings.push(createdProductSizing);
    }

    return createdProductSizings;
  }

  async indexAll() {
    return await this.prisma.productSizing.findMany();
  }

  async findAll(
    page: number,
    limit: number,
    searchName?: string,
    orderBy: string = 'createdAt',
    orderDirection: 'asc' | 'desc' = 'desc',
  ) {
    const total = await this.prisma.productSizing.count({
      where: this.whereCheckingNullClause,
    });
    const skip = (page - 1) * limit;

    const productSizings = await this.prisma.productSizing.findMany({
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
    return { data: productSizings, total, page, limit };
  }

  findOne(id: number) {
    return this.prisma.productSizing.findUnique({
      where: { id, AND: this.whereCheckingNullClause },
    });
  }

  async update(id: number, updateProductSizingDto: UpdateProductSizingDto) {
    const existingProductSizing = await this.prisma.productSizing.findUnique({
      where: { id, AND: this.whereCheckingNullClause },
    });

    if (!existingProductSizing) {
      throw new NotFoundException(`Product sizing with ID ${id} not found`);
    }
    return this.prisma.productSizing.update({
      where: { id },
      data: updateProductSizingDto,
    });
  }

  remove(id: number) {
    return this.prisma.productSizing.update({
      where: { id },
      data: { isArchived: new Date() },
    });
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
