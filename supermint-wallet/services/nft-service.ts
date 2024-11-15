interface NFTStatus {
  status: "PENDING" | "COMPLETED" | "FAILED";
}

export class NFTService {
  static async getNFTsFromDb(email: string): Promise<NFTStatus> {
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
        throw new Error("Failed to check NFT status");
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error checking NFT status:", error);
      throw error;
    }
  }
}
