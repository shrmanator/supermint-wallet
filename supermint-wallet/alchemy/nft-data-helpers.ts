import {
  Nft,
  NftContract,
  NftRawMetadata,
  NftCollection,
  NftResponse,
} from "./nft-types";

export function getNFTContract(nft: Nft): NftContract {
  return nft.contract;
}

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

export function getNFTMetadata(nft: Nft): NftRawMetadata | null {
  return nft?.raw?.metadata || null;
}

export function getNFTCollection(nft: Nft): NftCollection {
  return nft.collection;
}

export function getSupermintInfo(nft: Nft) {
  return nft?.raw?.metadata?.supermint || null;
}

export function getSeriesInfo(nft: Nft) {
  const metadata = getNFTMetadata(nft);
  const supermint = metadata?.supermint;

  return {
    title: supermint?.seriesTitle,
    artistName: supermint?.seriesArtistName,
    charityName: supermint?.charityName,
    seriesNumber: supermint?.seriesNumber,
    totalNFTs: supermint?.totalNftsInSeries,
    isInSet: supermint?.isInSet,
    setName: supermint?.setName,
    nftSetId: supermint?.nftSetId,
    setDescription: supermint?.setDescription,
  };
}

export function getNFTBasicInfo(nft: Nft) {
  return {
    tokenId: nft.tokenId,
    name: nft.name,
    description: nft.description,
    imageUrl: nft.image.cachedUrl || nft.raw.metadata.image,
    contractAddress: nft.contract.address,
    timeLastUpdated: nft.timeLastUpdated,
    balance: nft.balance,
  };
}

export function isValidNFT(nft: Nft): nft is Nft {
  return (
    nft &&
    typeof nft === "object" &&
    "tokenId" in nft &&
    "raw" in nft &&
    "metadata" in nft.raw
  );
}

export function parseNFTResponse(response: NftResponse) {
  return {
    nfts: response.ownedNfts,
    total: response.totalCount,
    blockInfo: response.validAt,
    hasMore: !!response.pageKey,
    nextPage: response.pageKey,
  };
}
