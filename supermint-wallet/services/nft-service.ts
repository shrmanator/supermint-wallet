// services/nft-service.ts
import { NFTResponse } from "@/types/nft-db-response";

export class NFTService {
  static async getNFTsFromDb(email: string): Promise<NFTResponse[]> {
    try {
      const response = await fetch(
        `/api/nfts/get-users-nfts-from-supermint-db/${encodeURIComponent(
          email
        )}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch NFTs");
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching DB NFTs:", error);
      throw error;
    }
  }
}
