import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createFittingsAndSizings(fittings: string[], sizings: string[]) {
  const sizingRecords = await Promise.all(
    sizings.map((name) => prisma.productSizing.create({ data: { name } })),
  );

  const fittingRecords = await Promise.all(
    fittings.map((name) => prisma.productFitting.create({ data: { name } })),
  );

  const relationships = fittingRecords.flatMap((fitting) =>
    sizingRecords.map((sizing) => ({
      productFittingId: fitting.id,
      productSizingId: sizing.id,
    })),
  );

  await prisma.productFittingProductSizing.createMany({
    data: relationships,
  });
}

export async function seedProductSizing() {
  await createFittingsAndSizings(
    ['Regular Fit', 'Slim Fit', 'Relaxed Fit'],
    ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
  );

  await createFittingsAndSizings(
    ['Inch Fit'],
    [
      '28 inches',
      '29 inches',
      '30 inches',
      '31 inches',
      '32 inches',
      '33 inches',
      '34 inches',
    ],
  );
  await createFittingsAndSizings(
    ['MM Fit'],
    ['30 mm', '31 mm', '32 mm', '33 mm', '34 mm', '35 mm', '36 mm'],
  );
  await createFittingsAndSizings(
    ['ML Fit'],
    ['5 ml', '15 ml', '30 ml', '50 ml', '100 ml', '125 ml', '150 ml'],
  );
  await createFittingsAndSizings(
    ['Footwear-US Fit'],
    ['8 US', '8.5 US', '9 US', '10 US', '11 US', '12 US', '13 US'],
  );
  await createFittingsAndSizings(
    ['Footwear-EU Fit'],
    ['35 EU', '36 EU', '37 EU', '38 EU', '39 EU', '40 EU', '41 EU'],
  );
  console.log('Sizing & Fitting have been seeded');
}
