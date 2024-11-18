/*
  Warnings:

  - You are about to drop the `NFTNotification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "NFTNotification" DROP CONSTRAINT "NFTNotification_userId_fkey";

-- DropTable
DROP TABLE "NFTNotification";

-- CreateTable
CREATE TABLE "ShownNFT" (
    "id" SERIAL NOT NULL,
    "tokenId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ShownNFT_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShownNFT_userId_tokenId_key" ON "ShownNFT"("userId", "tokenId");

-- AddForeignKey
ALTER TABLE "ShownNFT" ADD CONSTRAINT "ShownNFT_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
