import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

// Initialize the Prisma Client
const prisma = new PrismaClient();

async function main() {
  // Create two dummy users
  const passwordSabin = await argon2.hash('password-sabin');
  const passwordAlex = await argon2.hash('password-alex');

  const user1 = await prisma.user.upsert({
    where: { email: 'sabin@adams.com' },
    update: {
      password: passwordSabin,
    },
    create: {
      email: 'sabin@adams.com',
      name: 'Sabin Adams',
      password: passwordSabin,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'alex@ruheni.com' },
    update: {
      password: passwordAlex,
    },
    create: {
      email: 'alex@ruheni.com',
      name: 'Alex Ruheni',
      password: passwordAlex,
    },
  });

  const productSizing1 = await prisma.productSizing.create({
    data: {
      name: 'YourProductSizingName1',
      createdByUserId: user1.id,
      updatedByUserId: user2.id,
    },
  });

  const productSizing2 = await prisma.productSizing.create({
    data: {
      name: 'YourProductSizingName2',
      createdByUserId: user2.id,
      updatedByUserId: user1.id,
    },
  });

  await prisma.productType.create({
    data: {
      name: 'Clothing',
      createdByUserId: user1.id,
      updatedByUserId: user2.id,
    },
  });

  await prisma.productType.create({
    data: {
      name: 'Accessories',
      createdByUserId: user2.id,
      updatedByUserId: user1.id,
    },
  });
  await prisma.productType.create({
    data: {
      name: 'Foot Wear',
      createdByUserId: user2.id,
      updatedByUserId: user1.id,
    },
  });

  await prisma.productBrand.create({
    data: {
      name: 'Adidas',
      createdByUserId: 1,
      updatedByUserId: 1,
    },
  });

  await prisma.productBrand.create({
    data: {
      name: 'Accessories',
      createdByUserId: user2.id,
      updatedByUserId: user1.id,
    },
  });
  await prisma.productBrand.create({
    data: {
      name: 'Foot Wear',
      createdByUserId: user2.id,
      updatedByUserId: user1.id,
    },
  });
  console.log({ user1, user2, productSizing1, productSizing2 });
}

// Execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
