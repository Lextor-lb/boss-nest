/*
  Warnings:

  - Added the required column `name` to the `Special` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Special" ADD COLUMN     "name" TEXT NOT NULL;
