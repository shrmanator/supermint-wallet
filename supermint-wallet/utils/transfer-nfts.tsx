import { useSendTransaction, useActiveAccount } from "thirdweb/react";
import { getContract, prepareContractCall } from "thirdweb";
import { polygon } from "thirdweb/chains";
import { client } from "@/lib/client";

interface TransferERC1155Props {
  toAddress: string;
  tokenId: bigint;
}

export function useTransferERC1155() {
  const { mutate: sendTransaction, status, error } = useSendTransaction();
  const account = useActiveAccount();

  const transferERC1155 = async ({
    toAddress,
    tokenId,
  }: TransferERC1155Props) => {
    if (!account) {
      console.error("No wallet connected. Cannot perform transfer.");
      return;
    }

    if (!toAddress || !tokenId) {
      console.error("Invalid parameters for transfer.");
      return;
    }

    try {
      const contract = getContract({
        client: client,
        address: "0x4FdD394eF4a23d4Ad7303922c32295A17A570F9b",
        chain: polygon,
      });

      const transaction = prepareContractCall({
        contract,
        method:
          "function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data)",
        params: [account.address, toAddress, tokenId, BigInt(1), "0x"], // Use BigInt constructor
      });

      await sendTransaction(transaction);
      console.log("Transaction sent successfully.");
    } catch (err) {
      if (err instanceof Error) {
        console.error("Transfer failed. Error:", err.message);
      } else {
        console.error("An unknown error occurred during the transfer:", err);
      }
    }
  };

  return { transferERC1155, status, error };
}
