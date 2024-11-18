import { Nft } from "@/alchemy/nft-types";

/**
 * Gets the best available media source URL for an NFT
 * Prioritizes:
 * 1. Gateway URL from metadata
 * 2. Cached URL
 * 3. Original URL
 */
export const getNftMediaSrc = (nft: Nft): string | null => {
  return (
    nft.raw?.metadata?.image ||
    nft.image?.cachedUrl ||
    nft.image?.originalUrl ||
    null
  );
};
