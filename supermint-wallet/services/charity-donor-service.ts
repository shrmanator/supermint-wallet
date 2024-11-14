import { CharityDonorDetails } from "@/types/charity-donor-details";

export const charityDonorService = {
  async getCharityAndDonorDetails(
    tokenId: string
  ): Promise<CharityDonorDetails> {
    console.log("📡 Service - Fetching details for:", tokenId);

    const response = await fetch(`/api/user/details/${tokenId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch charity details");
    }

    return response.json();
  },
};
