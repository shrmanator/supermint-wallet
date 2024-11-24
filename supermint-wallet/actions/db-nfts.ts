"use server";

import { NftResponse } from "@/alchemy/nft-types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Returns tokenIds of NFTs that haven't been seen by the user yet
 */
export async function syncAndGetUnseenNFTs({
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
      ownedNfts: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Find new tokenIds (not in DB at all)
  const existingTokenIds = user.ownedNfts.map((nft) => nft.tokenId);
  const currentTokenIds = nftResponse.ownedNfts.map((nft) => nft.tokenId);
  const newTokenIds = currentTokenIds.filter(
    (tokenId) => !existingTokenIds.includes(tokenId)
  );

  // Record new NFTs as unseen
  if (newTokenIds.length > 0) {
    await prisma.ownedNFT.createMany({
      data: newTokenIds.map((tokenId) => ({
        userId: user.id,
        tokenId,
        seen: false,
      })),
      skipDuplicates: true,
    });
  }

  // Return all unseen NFTs (both new and existing unseen ones)
  const unseenNfts = await prisma.ownedNFT.findMany({
    where: {
      userId: user.id,
      seen: false,
    },
    select: {
      tokenId: true,
    },
  });

  return unseenNfts.map((nft) => nft.tokenId);
}

/**
 * Mark NFTs as seen by the user
 */
export async function markNFTsAsSeen({
  walletAddress,
  tokenIds,
}: {
  walletAddress: string;
  tokenIds: string[];
}): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { walletAddress },
    select: { id: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.ownedNFT.updateMany({
    where: {
      userId: user.id,
      tokenId: { in: tokenIds },
    },
    data: {
      seen: true,
    },
  });
}
