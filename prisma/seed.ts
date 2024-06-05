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

  console.log({ user1, user2 });

  // Create three dummy posts
  // ... (Add your post creation logic here)
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
