// Initialize the Prisma Client
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function seedProductType() {
  const types = ['Clothing', 'Accessories', 'Footwear'];
  await Promise.all(
    types.map((name) => prisma.productType.create({ data: { name } })),
  );
  await console.log('productTypes have been seeded');
}
