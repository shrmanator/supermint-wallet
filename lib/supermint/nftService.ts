// lib/thirdweb/nftService.ts
import axios from "axios";

// Define types for the parameters if necessary
interface ThirdwebLinkWalletAndClaimNFTParams {
  email: string;
  walletAddress: string;
  nftClaimToken: string;
}

export const thirdwebLinkWalletAndClaimNFT = async ({
  email,
  walletAddress,
  nftClaimToken,
}: ThirdwebLinkWalletAndClaimNFTParams): Promise<any> => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/thirdweb/link-wallet-and-process-all-claims`,
      {
        email,
        walletAddress,
        nftClaimToken,
      },
      {
        withCredentials: true, // Ensure cookies are sent with the request
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Link wallet result:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error linking wallet and claiming NFT:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("Server response:", error.response.data);
      throw error.response.data;
    }
    throw error;
  }
};
