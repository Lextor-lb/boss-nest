import { PrismaClient, UserRole } from '@prisma/client';
import * as argon2 from 'argon2';

// Initialize the Prisma Client
const prisma = new PrismaClient();

export default async function userSeeder() {
  // Create two dummy users

  const passwordNaingOo = await argon2.hash('SUvC2PpetyYgTZ7');
  const passwordPMA = await argon2.hash('LcjLp9FRhUzDArm');
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
      email: 'staff@staff.com',
      name: 'Alex Ruheni',
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
