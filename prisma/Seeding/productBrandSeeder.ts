import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function seedProductBrand() {
  const brandsWithMedia = [
    { name: 'Hugo Boss', mediaUrl: '/uploads/boy.jpg' },
    { name: 'Versace', mediaUrl: '/uploads/boy.jpg' },
    {
      name: 'Versace Jeans Culture',
      mediaUrl: '/uploads/boy.jpg',
    },
    { name: 'Adidas', mediaUrl: '/uploads/boy.jpg' },
    {
      name: 'Underamour',
      mediaUrl: '/uploads/boy.jpg',
    },
    { name: 'CR7', mediaUrl: '/uploads/boy.jpg' },
    { name: 'LV', mediaUrl: '/uploads/boy.jpg' },
  ];

  await Promise.all(
    brandsWithMedia.map(async (brand) => {
      // Create Media record
      const media = await prisma.media.create({
        data: { url: brand.mediaUrl },
      });

      // Create ProductBrand record with reference to Media
      await prisma.productBrand.create({
        data: {
          name: brand.name,
          media: {
            connect: { id: media.id },
          },
        },
      });
    }),
  );

  console.log('ProductBrands have been seeded');
}
