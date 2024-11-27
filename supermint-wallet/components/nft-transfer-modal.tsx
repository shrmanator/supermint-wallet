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
import { Nft } from "@/alchemy/nft-types";

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  nft: Nft;
}

export function TransferModal({ isOpen, onClose }: TransferModalProps) {
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [quantity, setQuantity] = useState("");

  const { transferERC1155, status, error } = useTransferERC1155();

  const handleTransfer = async () => {
    try {
      await transferERC1155({
        toAddress,
        tokenId: BigInt(tokenId),
        quantity: BigInt(quantity),
      });
      onClose(); // Close the modal on success
    } catch (err) {
      console.error("Transfer failed:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer ERC-1155 NFT</DialogTitle>
          <DialogDescription>
            Transfer the NFT to another address by filling out the details
            below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="From Address"
            value={fromAddress}
            onChange={(e) => setFromAddress(e.target.value)}
          />
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
          <Input
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
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
