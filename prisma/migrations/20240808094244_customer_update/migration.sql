/*
  Warnings:

  - The values [MAN,LADY] on the enum `Gender` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `gender` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cost` to the `VoucherRecord` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CustomerGender" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "ImageType" AS ENUM ('desktop', 'mobile');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('ORDERED', 'CANCEL', 'CONFIRM', 'DELIVERY', 'COMPLETE');

-- AlterEnum
BEGIN;
CREATE TYPE "Gender_new" AS ENUM ('MEN', 'WOMEN', 'UNISEX');
ALTER TABLE "Product" ALTER COLUMN "gender" TYPE "Gender_new" USING ("gender"::text::"Gender_new");
ALTER TYPE "Gender" RENAME TO "Gender_old";
ALTER TYPE "Gender_new" RENAME TO "Gender";
DROP TYPE "Gender_old";
COMMIT;

-- AlterEnum
ALTER TYPE "StatusStock" ADD VALUE 'ORDERED';

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "gender" "CustomerGender" NOT NULL;

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "imageType" "ImageType";

-- AlterTable
ALTER TABLE "VoucherRecord" ADD COLUMN     "cost" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Coupon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "couponId" TEXT NOT NULL,
    "discount" INTEGER NOT NULL,
    "expiredDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isArchived" TIMESTAMP(3),
    "createdByUserId" INTEGER,
    "updatedByUserId" INTEGER,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Slider" (
    "id" SERIAL NOT NULL,
    "place1DesktopId" INTEGER NOT NULL,
    "place1MobileId" INTEGER NOT NULL,
    "place2DesktopId" INTEGER NOT NULL,
    "place2MobileId" INTEGER NOT NULL,
    "place3DesktopId" INTEGER NOT NULL,
    "place3MobileId" INTEGER NOT NULL,
    "place4DesktopId" INTEGER NOT NULL,
    "place4MobileId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isArchived" TIMESTAMP(3),
    "createdByUserId" INTEGER,
    "updatedByUserId" INTEGER,

    CONSTRAINT "Slider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "orderId" TEXT NOT NULL,
    "orderStatus" "OrderStatus" NOT NULL DEFAULT 'ORDERED',
    "ecommerceUserId" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "subTotal" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isArchived" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderRecord" (
    "id" SERIAL NOT NULL,
    "productVariantId" INTEGER NOT NULL,
    "salePrice" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "orderId" INTEGER NOT NULL,
    "isArchived" TIMESTAMP(3),

    CONSTRAINT "OrderRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WishList" (
    "id" SERIAL NOT NULL,
    "wishlistId" TEXT NOT NULL,
    "ecommerceUserId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "isArchived" TIMESTAMP(3),

    CONSTRAINT "WishList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WishListRecord" (
    "id" SERIAL NOT NULL,
    "productVariantId" INTEGER NOT NULL,
    "salePrice" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "wishlistId" INTEGER NOT NULL,
    "isArchived" TIMESTAMP(3),

    CONSTRAINT "WishListRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Slider_place1DesktopId_key" ON "Slider"("place1DesktopId");

-- CreateIndex
CREATE UNIQUE INDEX "Slider_place1MobileId_key" ON "Slider"("place1MobileId");

-- CreateIndex
CREATE UNIQUE INDEX "Slider_place2DesktopId_key" ON "Slider"("place2DesktopId");

-- CreateIndex
CREATE UNIQUE INDEX "Slider_place2MobileId_key" ON "Slider"("place2MobileId");

-- CreateIndex
CREATE UNIQUE INDEX "Slider_place3DesktopId_key" ON "Slider"("place3DesktopId");

-- CreateIndex
CREATE UNIQUE INDEX "Slider_place3MobileId_key" ON "Slider"("place3MobileId");

-- CreateIndex
CREATE UNIQUE INDEX "Slider_place4DesktopId_key" ON "Slider"("place4DesktopId");

-- CreateIndex
CREATE UNIQUE INDEX "Slider_place4MobileId_key" ON "Slider"("place4MobileId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderId_key" ON "Order"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "WishList_wishlistId_key" ON "WishList"("wishlistId");

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slider" ADD CONSTRAINT "Slider_place1DesktopId_fkey" FOREIGN KEY ("place1DesktopId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slider" ADD CONSTRAINT "Slider_place1MobileId_fkey" FOREIGN KEY ("place1MobileId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slider" ADD CONSTRAINT "Slider_place2DesktopId_fkey" FOREIGN KEY ("place2DesktopId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slider" ADD CONSTRAINT "Slider_place2MobileId_fkey" FOREIGN KEY ("place2MobileId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slider" ADD CONSTRAINT "Slider_place3DesktopId_fkey" FOREIGN KEY ("place3DesktopId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slider" ADD CONSTRAINT "Slider_place3MobileId_fkey" FOREIGN KEY ("place3MobileId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slider" ADD CONSTRAINT "Slider_place4DesktopId_fkey" FOREIGN KEY ("place4DesktopId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slider" ADD CONSTRAINT "Slider_place4MobileId_fkey" FOREIGN KEY ("place4MobileId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_ecommerceUserId_fkey" FOREIGN KEY ("ecommerceUserId") REFERENCES "EcommerceUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderRecord" ADD CONSTRAINT "OrderRecord_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderRecord" ADD CONSTRAINT "OrderRecord_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishList" ADD CONSTRAINT "WishList_ecommerceUserId_fkey" FOREIGN KEY ("ecommerceUserId") REFERENCES "EcommerceUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishListRecord" ADD CONSTRAINT "WishListRecord_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES "WishList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishListRecord" ADD CONSTRAINT "WishListRecord_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
