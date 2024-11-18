import { CharityDonorDetails } from "@/types/charity-donor-details";

export async function getCharityAndDonorDetails(
  tokenId: string
): Promise<CharityDonorDetails> {
  const isServer = typeof window === "undefined";
  const baseUrl = isServer
    ? process.env.NEXT_PUBLIC_SUPERMINT_WALLET_SITE_ADDRESS
    : "";

  console.log("[CharityDetails] ENV:", {
    isServer,
    baseUrl,
    envVar: process.env.NEXT_PUBLIC_SUPERMINT_WALLET_SITE_ADDRESS,
  });

  try {
    const response = await fetch(`${baseUrl}/api/user/details/${tokenId}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("[CharityDetails] Error:", error);
    throw error;
  }
}
