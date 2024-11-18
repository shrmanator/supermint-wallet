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
  thumbnailUrl: string | null; // Changed from string
  pngUrl: string | null; // Changed from string
  contentType: string | null; // Changed from string
  size: number | null; // Changed from number
  originalUrl: string;
}

export interface NftRawMetadata {
  name: string;
  description: string;
  image: string;
  supermint: {
    isInSet: boolean;
    setName: string | null;
    nftSetId: number | null;
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
    trait_type:
      | "Series Title"
      | "Series Artist Name"
      | "Charity Name"
      | "Series Number"
      | "Total NFTs in Series"
      | "Is in Set"
      | "NFT Set ID"
      | "Set Name"
      | "Set Description"
      | "Set Size"
      | string; // Allow for other potential attributes
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
