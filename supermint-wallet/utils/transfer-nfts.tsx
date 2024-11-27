import { useSendTransaction, useActiveAccount } from "thirdweb/react";
import { getContract, prepareContractCall } from "thirdweb";
import { polygon } from "thirdweb/chains";
import { client } from "@/lib/client";

interface TransferERC1155Props {
  toAddress: string;
  tokenId: bigint;
  quantity: bigint;
}

export function useTransferERC1155() {
  const { mutate: sendTransaction, status, error } = useSendTransaction();
  const account = useActiveAccount(); // Access the active account

  const transferERC1155 = async ({
    toAddress,
    tokenId,
    quantity,
  }: TransferERC1155Props) => {
    if (!account) {
      console.error("No wallet connected. Cannot perform transfer.");
      return;
    }

    try {
      // Initialize the contract
      const contract = getContract({
        client: client,
        address:
          process.env.NEXT_PUBLIC_TOKEN_MANAGEMENT_PROXY_ADDRESS ||
          "no env var set",
        chain: polygon,
      });

      // Prepare the transaction
      const transaction = prepareContractCall({
        contract,
        method:
          "function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data)",
        params: [account.address, toAddress, tokenId, quantity, "0x"], // Use the connected wallet's address
      });

      // Send the transaction
      sendTransaction(transaction);
    } catch (err) {
      console.error("Transfer failed:", err);
    }
  };

  return { transferERC1155, status, error };
}
