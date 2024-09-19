import { PrismaClient, UserRole } from '@prisma/client';
import * as argon2 from 'argon2';

// Initialize the Prisma Client
const prisma = new PrismaClient();

export default async function userSeeder() {
  // Create two dummy users

  const passwordNaingOo = await argon2.hash('eawtrjuC4AzREHa');
  const passwordPMA = await argon2.hash('73cdqQ3B29Q7Hm6');
  const passwordLMA = await argon2.hash('JEpb3Px2RgnpGPF');

  await prisma.user.upsert({
    where: { email: 'naingOo@admin.com' },
    update: {
      password: passwordNaingOo,
    },
    create: {
      email: 'naingOo@admin.com',
      name: 'NaingOo Ko Ko',
      password: passwordNaingOo,
      role: UserRole.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: 'phyoMinAung@admin.com' },
    update: {
      password: passwordPMA,
    },
    create: {
      email: 'phyoMinAung@admin.com',
      name: 'Phyo Min Aung',
      password: passwordPMA,
      role: UserRole.ADMIN,
    },
  });
  await prisma.user.upsert({
    where: { email: 'lwinMoeAung@staff.com' },
    update: {
      password: passwordLMA,
    },
    create: {
      email: 'lwinMoeAung@staff.com',
      name: 'Lwin Moe Aung',
      password: passwordLMA,
      role: UserRole.STAFF,
    },
  });
  await console.log('Users have been seeded');
}
