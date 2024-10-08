export interface NftContract {
  address: string;
  name: string | null;
  symbol: string | null;
  totalSupply: string | null;
  tokenType: string;
  contractDeployer: string;
  deployedBlockNumber: number;
  openSeaMetadata: {
    floorPrice: number | null;
    collectionName: string;
    collectionSlug: string;
    safelistRequestStatus: string;
    imageUrl: string;
    description: string | null;
    externalUrl: string | null;
    twitterUsername: string | null;
    discordUrl: string | null;
    bannerImageUrl: string | null;
    lastIngestedAt: string;
  };
  isSpam: boolean | null;
  spamClassifications: string[];
}

export interface NftImage {
  cachedUrl: string;
  thumbnailUrl: string;
  pngUrl: string;
  contentType: string;
  size: number;
  originalUrl: string;
}

export interface NftRawMetadata {
  name: string;
  description: string;
  image: string;
  supermint: {
    isInSet: boolean;
    setName: string | null;
    nftSetId: string | null;
    seriesDescription: string;
    totalNftsInSeries: number;
    payload: string;
    charityName: string;
    setDescription: string | null;
    seriesNumber: number;
    seriesTitle: string;
    seriesArtistName: string;
  };
  attributes: Array<{
    value: string | number | boolean;
    trait_type: string;
  }>;
  payload: string;
}

export interface NftCollection {
  name: string;
  slug: string;
  externalUrl: string | null;
  bannerImageUrl: string | null;
}

export interface NftMint {
  mintAddress: string | null;
  blockNumber: number | null;
  timestamp: string | null;
  transactionHash: string | null;
}

export interface Nft {
  contract: NftContract;
  tokenId: string;
  tokenType: string;
  name: string;
  description: string;
  tokenUri: string;
  image: NftImage;
  raw: {
    tokenUri: string;
    metadata: NftRawMetadata;
    error: string | null;
  };
  collection: NftCollection;
  mint: NftMint;
  owners: unknown; // Define a type for owners if it's sometimes non-null
  timeLastUpdated: string;
  balance: string;
  acquiredAt: {
    blockTimestamp: string | null;
    blockNumber: number | null;
  };
}

export interface NftResponse {
  ownedNfts: Nft[];
  totalCount: number;
  validAt: {
    blockNumber: number;
    blockHash: string;
    blockTimestamp: string;
  };
  pageKey: string | null;
}
