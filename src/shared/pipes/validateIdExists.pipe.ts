import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const modelMap = {
  EcommerceCategory: prisma.ecommerceCategory,
  ProductBrand: prisma.productBrand,
  ProductSizing: prisma.productSizing,
  ProductFitting: prisma.productFitting,
  ProductType: prisma.productType,
  ProductCategory: prisma.productCategory,
  Product: prisma.product,
  Voucher: prisma.voucher,
};

@Injectable()
export class ValidateIdExistsPipe implements PipeTransform {
  constructor(private readonly table: string) {}

  async transform(value: any) {
    const id = parseInt(value, 10);

    if (isNaN(id)) {
      throw new NotFoundException(`Invalid ID`);
    }

    const model = modelMap[this.table];

    if (!model) {
      throw new Error(`Unknown table: ${this.table}`);
    }

    const record = await model.findUnique({
      where: { id, isArchived: null },
    });

    if (!record) {
      throw new NotFoundException(`${this.table} with ID ${id} not found.`);
    }

    return id;
  }
}
