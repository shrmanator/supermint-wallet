import {
  LinkWalletParams,
  NFTClaimResult,
} from "@/types/link-wallet-and-claim-nft";

export async function createWalletUser(userData: {
  walletAddress: string;
  email: string;
  name: string;
}) {
  const response = await fetch("http://localhost:5000/api/internal/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.INTERNAL_SERVICE_KEY!,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return response.json();
}

export async function linkWalletAndClaimNFT(
  params: LinkWalletParams
): Promise<NFTClaimResult> {
  const response = await fetch("/api/wallet/link-and-process", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const result = await response.json();

  return {
    statusCode: response.status,
    message: result.message || "Operation completed",
    data: result.data
      ? {
          success: result.data.success || false,
          message: result.data.message || "",
        }
      : undefined,
  };
}
