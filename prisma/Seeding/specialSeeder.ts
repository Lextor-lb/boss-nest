// name: 'VVIP',
//       promotionRate: 15,

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function seedSpecial() {
  const specialDetails = [
    {
      name: 'VVIP',
      promotionRate: 15,
    },
    {
      name: 'VIP',
      promotionRate: 10,
    },
    {
      name: 'Regular',
      promotionRate: 5,
    },
    {
      name: 'New Customer',
      promotionRate: 7,
    },
    {
      name: 'Loyalty Member',
      promotionRate: 12,
    },
  ];

  await Promise.all(
    specialDetails.map(async (special) => {
      await prisma.special.create({
        data: {
          name: special.name,
          promotionRate: special.promotionRate,
        },
      });
    }),
  );

  await console.log('Specials have been seeded');
}
