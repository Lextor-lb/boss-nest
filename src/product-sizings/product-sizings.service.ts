import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductSizingDto } from './dto/create-product-sizing.dto';
import { Prisma } from '@prisma/client';
import { UpdateProductSizingDto } from './dto/update-product-sizing.dto';

@Injectable()
export class ProductSizingsService {
  constructor(private prisma: PrismaService) {}

  whereClause: Prisma.ProductSizingWhereInput = {
    isArchived: null,
  };

  create(createProductSizingDto: CreateProductSizingDto) {
    return this.prisma.productSizing.create({ data: createProductSizingDto });
  }

  async indexAll() {
    return await this.prisma.productSizing.findMany();
  }

  async findAll(page: number, limit: number) {
    const total = await this.prisma.productSizing.count({
      where: this.whereClause,
    });
    const skip = (page - 1) * limit;

    const productSizings = await this.prisma.productSizing.findMany({
      where: this.whereClause,
      skip,
      take: limit,
    });
    return { data: productSizings, total, page, limit };
  }

  findOne(id: number) {
    return this.prisma.productSizing.findUnique({
      where: { id, AND: this.whereClause },
    });
  }

  async update(id: number, updateProductSizingDto: UpdateProductSizingDto) {
    const existingProductSizing = await this.prisma.productSizing.findUnique({
      where: { id, AND: this.whereClause },
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

  async removeMany(ids: number[]) {
    const { count } = await this.prisma.productSizing.updateMany({
      where: { id: { in: ids } },
      data: { isArchived: new Date() },
    });

    return {
      status: true,
      message: `Deleted ${count} product sizings successfully.`,
    };
  }
}
