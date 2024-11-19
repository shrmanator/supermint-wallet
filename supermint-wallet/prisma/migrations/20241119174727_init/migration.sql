/*
  Warnings:

  - You are about to drop the `NFTAlertHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "NFTAlertHistory" DROP CONSTRAINT "NFTAlertHistory_userId_fkey";

-- DropTable
DROP TABLE "NFTAlertHistory";

-- CreateTable
CREATE TABLE "OwnedNFT" (
    "id" SERIAL NOT NULL,
    "tokenId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "shownAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OwnedNFT_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OwnedNFT_userId_tokenId_key" ON "OwnedNFT"("userId", "tokenId");

-- AddForeignKey
ALTER TABLE "OwnedNFT" ADD CONSTRAINT "OwnedNFT_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
