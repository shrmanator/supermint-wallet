// services/NFTService.ts
import { NFTResponse } from "@/types/nft-db-response";

export class NFTService {
  static async getNFTsFromDb(email: string): Promise<NFTResponse[]> {
    try {
      const response = await fetch(
        `/api/nfts/get-users-nfts-from-supermint-db/${encodeURIComponent(
          email
        )}/nfts`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch NFTs");
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error in getDonorNFTs:", error);
      throw error;
    }
  }
}
