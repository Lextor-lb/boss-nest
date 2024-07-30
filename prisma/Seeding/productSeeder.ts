import { Gender, PrismaClient } from '@prisma/client';
import { eachDayOfInterval } from 'date-fns';

const prisma = new PrismaClient();

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const genders = [Gender.WOMEN, Gender.MEN, Gender.UNISEX];
function getRandomGender() {
  return genders[Math.floor(Math.random() * genders.length)];
}

function getRandomBoolean() {
  return Math.random() < 0.5;
}

export default async function seedProduct() {
  const endDate = new Date();
  const startDate = new Date(2024, 3, 1); // Months are 0-indexed in JS
  const period = eachDayOfInterval({ start: startDate, end: endDate });

  let id = 1;

  for (const day of period) {
    const productCount = Math.floor(Math.random() * 5) + 3;
    const variants = [];
    const mediaEntries = [];

    for (let i = 1; i <= productCount; i++) {
      const product = await prisma.product.create({
        data: {
          name: `PhaNap.${id}`,
          productCode: Math.random().toString(36).substring(2, 10),
          description: 'PhaNap description',
          isEcommerce: getRandomBoolean(),
          isPos: true,
          gender: getRandomGender(),
          productBrandId: getRandomInt(1, 7),
          productTypeId: getRandomInt(1, 3),
          productCategoryId: getRandomInt(19, 21),
          productFittingId: 7,
          stockPrice: 1000,
          salePrice: getRandomInt(1200, 50000),
          discountPrice: 0,
          createdAt: day,
          updatedAt: day,
        },
      });

      // Create media for the product
      const productMedia = await prisma.media.create({
        data: {
          url: '/uploads/sample/boy.jpg',
          createdAt: day,
          updatedAt: day,
          productId: product.id,
        },
      });

      mediaEntries.push(productMedia);

      const variantCount = Math.floor(Math.random() * 5) + 3;
      for (let j = 1; j <= variantCount; j++) {
        // Create media for the product variant
        const variantMedia = await prisma.media.create({
          data: {
            url: '/uploads/sample/boy.jpg',
            createdAt: day,
            updatedAt: day,
          },
        });

        mediaEntries.push(variantMedia);

        const variant = await prisma.productVariant.create({
          data: {
            productId: product.id,
            shopCode: 'bN',
            colorCode: Math.random().toString(36).substring(2, 10),
            productSizingId: getRandomInt(29, 42),
            barcode: Math.random().toString(36).substring(2, 10),
            mediaId: variantMedia.id,
            createdAt: day,
            updatedAt: day,
          },
        });
      }

      id++;
    }

    await prisma.productVariant.createMany({ data: variants });
  }

  console.log('Products have been seeded');
}
