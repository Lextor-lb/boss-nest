import { PrismaClient, UserRole } from '@prisma/client';
import * as argon2 from 'argon2';

// Initialize the Prisma Client
const prisma = new PrismaClient();

export default async function userSeeder() {
  // Create two dummy users

  const passwordSabin = await argon2.hash('password-sabin');
  const passwordAlex = await argon2.hash('password-staff');

  await prisma.user.upsert({
    where: { email: 'sabin@adams.com' },
    update: {
      password: passwordSabin,
    },
    create: {
      email: 'sabin@adams.com',
      name: 'Sabin Adams',
      password: passwordSabin,
      role: UserRole.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: 'staff@staff.com' },
    update: {
      password: passwordAlex,
    },
    create: {
      email: 'staff@staff.com',
      name: 'Alex Ruheni',
      password: passwordAlex,
      role: UserRole.STAFF,
    },
  });
  await console.log('Users have been seeded');
}
