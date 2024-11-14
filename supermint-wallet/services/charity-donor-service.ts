import {
  CharityDonorDetails,
  CharityDonorError,
} from "@/types/charity-donor-details";

export const walletService = {
  async getCharityAndDonorDetails(
    tokenId: string
  ): Promise<CharityDonorDetails> {
    const response = await fetch(`/api/user/details/${tokenId}`);
    const data = await response.json();

    if (!response.ok) {
      throw {
        error: data.error || "Failed to fetch details",
        statusCode: response.status,
        message: data.message,
      } as CharityDonorError;
    }

    return data;
  },
};
