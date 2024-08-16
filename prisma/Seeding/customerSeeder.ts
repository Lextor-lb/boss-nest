import { AgeRange, CustomerGender, Gender, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function seedCustomer() {
  const customerDetails = [
    {
      name: 'Your Customer',
      phoneNumber: '93785383',
      email: 'customer1@gmail.com',
      address: 'Yangon',
      gender: CustomerGender.Male,
      specialId: 2,
    },
    {
      name: 'Your Customer 2',
      phoneNumber: '937853883',
      address: 'Yangon',
      gender: CustomerGender.Female,
      specialId: 2,
      remark: 'More Discount for me',
    },
    {
      name: 'Your Customer 3',
      phoneNumber: '937853884',
      address: 'Mandalay',
      email: 'customer3@gmail.com',
      gender: CustomerGender.Male,
      specialId: 3,
    },
    {
      name: 'Your Customer 4',
      phoneNumber: '937853885',
      address: 'Naypyidaw',
      gender: CustomerGender.Male,
      specialId: 1,
      remark: 'Frequent Buyer',
    },
    {
      name: 'Your Customer 5',
      phoneNumber: '937853886',
      address: 'Bago',
      gender: CustomerGender.Female,
      specialId: 3,
    },
    {
      name: 'Your Customer 6',
      phoneNumber: '937853887',
      address: 'Mawlamyine',
      email: 'customer6@gmail.com',
      gender: CustomerGender.Male,
      remark: 'VIP Customer',
      specialId: 3,
    },
    {
      name: 'Your Customer 7',
      phoneNumber: '937853888',
      address: 'Pathein',
      gender: CustomerGender.Male,
      specialId: 2,
    },
    {
      name: 'Your Customer 8',
      phoneNumber: '937853889',
      address: 'Taunggyi',
      gender: CustomerGender.Male,
      specialId: 2,
    },
    {
      name: 'Your Customer 9',
      phoneNumber: '937853890',
      address: 'Pyin Oo Lwin',
      gender: CustomerGender.Female,
      remark: 'Loyal Customer',
      specialId: 3,
    },
    {
      name: 'Your Customer 10',
      phoneNumber: '937853891',
      address: 'Hpa-An',
      gender: CustomerGender.Male,
      specialId: 1,
    },
  ];

  await Promise.all(
    customerDetails.map(async (customer) => {
      await prisma.customer.create({
        data: {
          name: customer.name,
          ageRange: AgeRange.MIDDLE,
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
