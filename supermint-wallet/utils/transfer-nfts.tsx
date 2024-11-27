// lib/transferNFT.ts
import { getContract } from "thirdweb";
import { polygon } from "thirdweb/chains";
import { client } from "@/lib/client";

/**
 * Transfers an NFT from the connected wallet to a specified recipient.
 *
 * @param tokenId - The ID of the token to transfer.
 * @param recipient - The address of the recipient.
 * @param sender - The address of the sender (connected wallet).
 * @returns A promise that resolves when the transaction is complete.
 */
export async function transferNFT(
  tokenId: string,
  recipient: string,
  sender: string
): Promise<void> {
  try {
    const contract = getContract({
      client,
      address:
        process.env.NEXT_PUBLIC_TOKEN_MANAGEMENT_PROXY_ADDRESS ||
        "no env var set",
      chain: polygon,
    });

    const transaction = {
      to: contract.getAddress(),
      data: contract.encoder.encode("safeTransferFrom", [
        sender,
        recipient,
        tokenId,
      ]),
    };

    await client.wallet.sendTransaction(transaction);
    console.log("NFT transferred successfully");
  } catch (err) {
    console.error("Error transferring NFT:", err);
    throw err;
  }
}
