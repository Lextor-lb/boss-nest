import { PrismaClient } from '@prisma/client';
import userSeeder from './Seeding/userSeeder';
import { seedProductSizing } from './Seeding/productSizingSeeder';
import seedProductType from './Seeding/productTypeSeeder';
import seedProductBrand from './Seeding/productBrandSeeder';
import { seedProductCategory } from './Seeding/productCategorySeeder';
import seedProduct from './Seeding/productSeeder';
import seedSpecial from './Seeding/specialSeeder';
import seedCustomer from './Seeding/customerSeeder';
import seedVouchers from './Seeding/voucherSeeder';

// Initialize the Prisma Client
const prisma = new PrismaClient();

async function main() {
  await userSeeder();
  // await seedProductSizing();
  // await seedProductType();
  // await seedProductBrand();
  // await seedProductCategory();
  // await seedProduct();
  // await seedSpecial();
  // await seedCustomer();
  // await seedVouchers();
  await console.log('Seeding Success!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
