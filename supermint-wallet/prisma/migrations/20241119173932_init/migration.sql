/*
  Warnings:

  - You are about to drop the `ShownNFT` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ShownNFT" DROP CONSTRAINT "ShownNFT_userId_fkey";

-- DropTable
DROP TABLE "ShownNFT";

-- CreateTable
CREATE TABLE "NFTAlertHistory" (
    "id" SERIAL NOT NULL,
    "tokenId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "shownAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NFTAlertHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NFTAlertHistory_userId_tokenId_key" ON "NFTAlertHistory"("userId", "tokenId");

-- AddForeignKey
ALTER TABLE "NFTAlertHistory" ADD CONSTRAINT "NFTAlertHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
