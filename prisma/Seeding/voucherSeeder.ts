import { faker } from '@faker-js/faker';
import { addDays, subMonths } from 'date-fns';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function seedVouchers() {
  const startDate = subMonths(new Date(), 7);
  const endDate = new Date();
  const subTotal = faker.number.int({ min: 2000, max: 3000 });
  let id = 1;

  for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
    const vouchers = [];
    const create = [];
    const count = faker.number.int({ min: 2, max: 5 });
    const customerIds = faker.number.int({ min: 1, max: 10 });
    const voucherCode = faker.string.alphanumeric(6) + '@';

    vouchers.push({
      voucherCode: voucherCode,
      paymentMethod: 'CASH',
      type: 'ONLINE',
      subTotal: subTotal,
      total: subTotal + 1000,
      customerId: customerIds,
      createdAt: date,
      updatedAt: date,
      quantity: count,
    });

    await prisma.voucher.createMany({
      data: vouchers,
    });

    for (let i = 0; i < count; i++) {
      const variantId = faker.number.int({ min: 1, max: 1500 });

      const productVariant = await prisma.productVariant.findUnique({
        where: { id: variantId },
        select: {
          productSizing: { select: { name: true } },
          product: {
            select: {
              name: true,
              gender: true,
              stockPrice: true,
              salePrice: true,
              productBrand: { select: { name: true } },
              productType: { select: { name: true } },
              productCategory: { select: { name: true } },
              productFitting: { select: { name: true } },
            },
          },
        },
      });

      if (!productVariant) continue;

      const productJsonData = {
        name: productVariant.product.name,
        gender: productVariant.product.gender,
        productBrand: productVariant.product.productBrand.name,
        productType: productVariant.product.productType.name,
        productCategory: productVariant.product.productCategory.name,
        productFitting: productVariant.product.productFitting.name,
        productSizing: productVariant.productSizing.name,
        stockPrice: productVariant.product.stockPrice,
        salePrice: productVariant.product.salePrice,
      };

      create.push({
        voucherId: id,
        productVariantId: variantId,
        discount: 10,
        product: productJsonData,
        createdAt: date,
        updatedAt: date,
      });

      await prisma.productVariant.update({
        where: { id: variantId },
        data: { statusStock: 'SOLDOUT' },
      });
    }

    await prisma.voucherRecord.createMany({
      data: create,
    });

    id++;
  }
  await console.log('Vouchers have been seeded');
}
