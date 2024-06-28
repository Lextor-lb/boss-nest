import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createFittingsAndSizings(
  categories: { name: string; productTypeId: number }[],
  sizingIds: number[],
) {
  const categoryRecords = await Promise.all(
    categories.map(({ name, productTypeId }) =>
      prisma.productCategory.create({ data: { name, productTypeId } }),
    ),
  );

  const relationships = categoryRecords.flatMap((category) =>
    sizingIds.map((id) => ({
      productCategoryId: category.id,
      productFittingId: id,
    })),
  );

  await prisma.productCategoryProductFitting.createMany({
    data: relationships,
  });
}

export async function seedProductCategory() {
  const categories1 = [
    { name: 'Polo Shirt', productTypeId: 1 },
    { name: 'T-shirt', productTypeId: 1 },
    { name: 'Sweatshirt', productTypeId: 1 },
    { name: 'Hoodie', productTypeId: 1 },
    { name: 'Jacket', productTypeId: 1 },
    { name: 'Under-wears', productTypeId: 1 },
    { name: 'Shirt', productTypeId: 1 },
    { name: 'Socks', productTypeId: 1 },
    { name: 'Style Pant', productTypeId: 1 },
    { name: 'Jeans Pant', productTypeId: 1 },
    { name: 'Short Pant', productTypeId: 1 },
  ];
  const categories2 = [
    { name: 'Cap', productTypeId: 2 },
    { name: 'Bag', productTypeId: 2 },
    { name: 'Wallet', productTypeId: 2 },
    { name: 'Belt', productTypeId: 2 },
    { name: 'Watches', productTypeId: 2 },
    { name: 'SunGlass', productTypeId: 2 },
  ];
  const categories3 = [{ name: 'Perfume', productTypeId: 2 }];
  const categories4 = [
    { name: 'Slipper', productTypeId: 3 },
    { name: 'Slides & Flip Flops', productTypeId: 3 },
    { name: 'Shoe', productTypeId: 3 },
  ];

  await createFittingsAndSizings(categories1, [1, 2, 3]);
  await createFittingsAndSizings(categories2, [4, 5]);
  await createFittingsAndSizings(categories3, [6]);
  await createFittingsAndSizings(categories4, [7, 8]);

  console.log('ProductCategories have been seeded');
}
