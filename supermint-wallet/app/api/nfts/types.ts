/**
 * Response type for Alchemy's getNFTsForOwner endpoint
 * @see https://docs.alchemy.com/reference/getnfts
 */
export interface AlchemyNFTResponse {
  ownedNfts: Array<{
    contract: Record<string, unknown>; // Full contract details are nested
    tokenId: string;
    tokenType: "ERC1155" | "ERC20" | "ERC720"; // Add other token types if needed
    name: string;
    description: string;
    tokenUri: string;
    image: Record<string, unknown>; // Image details
    raw: Record<string, unknown>; // Raw metadata
    collection: Record<string, unknown>; // Collection details
    mint: Record<string, unknown>; // Minting details
    owners: null | Array<string>; // Owner addresses if available
    timeLastUpdated: string; // ISO timestamp
    balance: string; // Token balance as string
    acquiredAt: Record<string, unknown>; // Acquisition details
  }>;
  totalCount: number;
  validAt: {
    blockNumber: number;
    blockHash: string;
    blockTimestamp: string; // ISO timestamp
  };
  pageKey: string | null; // Pagination key if available
}
