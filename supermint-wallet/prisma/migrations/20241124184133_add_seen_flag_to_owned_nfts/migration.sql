/*
  Warnings:

  - You are about to drop the column `shownAt` on the `OwnedNFT` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OwnedNFT" DROP COLUMN "shownAt",
ADD COLUMN     "seen" BOOLEAN NOT NULL DEFAULT false;
