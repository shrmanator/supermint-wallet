"use server";

import { NftResponse } from "@/alchemy/nft-types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Returns array of new tokenIds that haven't been seen before
 */
export async function syncAndCheckNewNFTs({
  walletAddress,
  nftResponse,
}: {
  walletAddress: string;
  nftResponse: NftResponse;
}): Promise<string[]> {
  const user = await prisma.user.findUnique({
    where: { walletAddress },
    select: {
      id: true,
      ownedNfts: {
        select: { tokenId: true },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const existingTokenIds = user.ownedNfts.map((nft) => nft.tokenId);
  const currentTokenIds = nftResponse.ownedNfts.map((nft) => nft.tokenId);

  // Find new tokenIds
  const newTokenIds = currentTokenIds.filter(
    (tokenId) => !existingTokenIds.includes(tokenId)
  );

  if (newTokenIds.length > 0) {
    await prisma.ownedNFT.createMany({
      data: newTokenIds.map((tokenId) => ({
        userId: user.id,
        tokenId,
      })),
      skipDuplicates: true,
    });
  }

  return newTokenIds; // Just return the new tokenIds
}
