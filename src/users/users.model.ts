import { Prisma } from '@prisma/client';

export class User implements Prisma.UserCreateInput {
  name: string;
  email: string;
  role: 'ADMIN' | 'STUFF'; // Assuming these are the possible values for role
  password: string;
  phoneNumber: number; // Missing property added
  createdAt?: Date | string; // Optional field with default value
  updatedAt?: Date | string; // Optional field with default value
  isArchived?: Date | null; // Nullable field

  // You might need to add any other required methods or properties
}
