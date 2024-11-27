import { useSendTransaction } from "thirdweb/react";
import { getContract, prepareContractCall } from "thirdweb";
import { polygon } from "thirdweb/chains";
import { client } from "@/lib/client";

interface TransferERC1155Props {
  fromAddress: string;
  toAddress: string;
  tokenId: bigint;
  quantity: bigint;
}

export function useTransferERC1155() {
  const { mutate: sendTransaction, status, error } = useSendTransaction();

  const transferERC1155 = async ({
    fromAddress,
    toAddress,
    tokenId,
    quantity,
  }: TransferERC1155Props) => {
    try {
      // Initialize the contract
      const contract = getContract({
        client: client, // Ensure 'client' is imported from your client setup
        address:
          process.env.NEXT_PUBLIC_TOKEN_MANAGEMENT_PROXY_ADDRESS ||
          "no env var set",
        chain: polygon, // Replace with your target chain
      });

      // Prepare the transaction
      const transaction = prepareContractCall({
        contract,
        method:
          "function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data)",
        params: [fromAddress, toAddress, tokenId, quantity, "0x"],
      });

      // Send the transaction
      sendTransaction(transaction);
    } catch (err) {
      console.error("Transfer failed:", err);
    }
  };

  return { transferERC1155, status, error };
}
