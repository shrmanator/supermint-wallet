"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransferERC1155 } from "@/utils/transfer-nfts";
import { useActiveAccount } from "thirdweb/react"; // Import the hook
import { Nft } from "@/alchemy/nft-types";
import { useToast } from "@/hooks/use-toast";

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  nft: Nft;
}

export function TransferModal({ isOpen, onClose }: TransferModalProps) {
  const [toAddress, setToAddress] = useState("");
  const [tokenId, setTokenId] = useState("");

  const { transferERC1155, status, error } = useTransferERC1155();
  const account = useActiveAccount();
  const { toast } = useToast(); // Initialize the toast hook

  const handleTransfer = async () => {
    if (!account) {
      console.error("No wallet connected. Cannot perform transfer.");
      toast({
        title: "No Wallet Connected",
        description: "Please connect your wallet to perform the transfer.",
        variant: "destructive",
      });
      return;
    }

    try {
      await transferERC1155({
        toAddress,
        tokenId: BigInt(tokenId),
      });
      toast({
        title: "Transfer Successful",
        description: `NFT with Token ID ${tokenId} has been transferred to ${toAddress}.`,
      });
      onClose(); // Close the modal on success
    } catch (err) {
      console.error("Transfer failed:", err);
      toast({
        title: "Transfer Failed",
        description:
          err instanceof Error ? err.message : "An unknown error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer ERC-1155 NFT</DialogTitle>
          <DialogDescription>
            Transfer the NFT to another wallet by filling out the details below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p>
            <strong>From Address:</strong> {account?.address || "Not Connected"}
          </p>
          <Input
            placeholder="To Address"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
          />
          <Input
            placeholder="Token ID"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleTransfer} disabled={status === "pending"}>
            {status === "pending" ? "Transferring..." : "Transfer"}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
        {status === "error" && <p>Error: {error?.message}</p>}
      </DialogContent>
    </Dialog>
  );
}
