import {
  CreateWalletUserData,
  LinkWalletParams,
  NFTClaimResult,
} from "@/types/link-wallet-and-claim-nft";

export async function createWalletUser(userData: CreateWalletUserData) {
  const response = await fetch("/api/user/create-wallet", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return response.json();
}

export async function linkWalletAndClaimNFTs(
  params: LinkWalletParams
): Promise<NFTClaimResult> {
  const response = await fetch("/api/user/link-user-and-process-nfts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const result = await response.json();
  return result;
}
