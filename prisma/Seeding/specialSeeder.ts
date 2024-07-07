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
      promotionRate: 10
    }
  ];

  await Promise.all(
    specialDetails.map(async(special) => {
        await prisma.special.create({
            data: {
                name: special.name,
                promotionRate: special.promotionRate
            }
        })
    })
  )

  await console.log('Specials have been seeded');
}
