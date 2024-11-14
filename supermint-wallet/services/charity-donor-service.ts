import { CharityDonorDetails } from "@/types/charity-donor-details";

// services/charity-donor-service.ts
export async function getCharityAndDonorDetails(
  tokenId: string
): Promise<CharityDonorDetails> {
  // Check if running on the server
  const isServer = typeof window === "undefined";
  const baseUrl = isServer
    ? process.env.NEXT_PUBLIC_SUPERMINT_WALLET_SITE_ADDRESS // Ensure this environment variable is set
    : "";

  const response = await fetch(`${baseUrl}/api/user/details/${tokenId}`, {
    cache: "no-store", // Prevent caching in server components
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return response.json();
}
