import { Gender, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function seedCustomer() {
  const customerDetails = [
    {
      name: 'Your Customer',
      phoneNumber: '93785383',
      address: 'Yangon',
      gender: Gender.MEN,
      specialId: 2,
    },
    {
      name: 'Your Customer 2',
      phoneNumber: '937853883',
      address: 'Yangon',
      gender: Gender.WOMEN,
      specialId: 2,
      remark: 'More Discount for me',
    },
    {
      name: 'Your Customer 3',
      phoneNumber: '937853884',
      address: 'Mandalay',
      gender: Gender.MEN,
      specialId: 3,
    },
    {
      name: 'Your Customer 4',
      phoneNumber: '937853885',
      address: 'Naypyidaw',
      gender: Gender.UNISEX,
      specialId: 1,
      remark: 'Frequent Buyer',
    },
    {
      name: 'Your Customer 5',
      phoneNumber: '937853886',
      address: 'Bago',
      gender: Gender.MEN,
      specialId: 3,
    },
    {
      name: 'Your Customer 6',
      phoneNumber: '937853887',
      address: 'Mawlamyine',
      gender: Gender.UNISEX,
      remark: 'VIP Customer',
      specialId: 3,
    },
    {
      name: 'Your Customer 7',
      phoneNumber: '937853888',
      address: 'Pathein',
      gender: Gender.MEN,
      specialId: 2,
    },
    {
      name: 'Your Customer 8',
      phoneNumber: '937853889',
      address: 'Taunggyi',
      gender: Gender.WOMEN,
      specialId: 2,
    },
    {
      name: 'Your Customer 9',
      phoneNumber: '937853890',
      address: 'Pyin Oo Lwin',
      gender: Gender.MEN,
      remark: 'Loyal Customer',
      specialId: 3,
    },
    {
      name: 'Your Customer 10',
      phoneNumber: '937853891',
      address: 'Hpa-An',
      gender: Gender.MEN,
      specialId: 1,
    },
  ];

  await Promise.all(
    customerDetails.map(async (customer) => {
      await prisma.customer.create({
        data: {
          name: customer.name,
          ageRange: 'MIDDLE',
          phoneNumber: customer.phoneNumber,
          address: customer.address,
          gender: customer.gender,
          specialId: customer.specialId,
          remark: customer.remark,
          dateOfBirth: new Date('1979-08-30T00:00:00.000Z'),
        },
      });
    }),
  );

  console.log('Customers have been seeded');
}
