"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransferERC1155 } from "@/utils/transfer-nfts";

export function TransferModal() {
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [quantity, setQuantity] = useState("");

  const { transferERC1155, status, error } = useTransferERC1155();

  const handleTransfer = async () => {
    try {
      await transferERC1155({
        fromAddress,
        toAddress,
        tokenId: BigInt(tokenId),
        quantity: BigInt(quantity),
      });
    } catch (err) {
      console.error("Transfer failed:", err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Transfer Modal</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer ERC-1155 NFT</DialogTitle>
          <DialogDescription>
            Enter the details below to transfer your NFT.
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
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
        </DialogFooter>
        {status === "error" && <p>Error: {error?.message}</p>}
      </DialogContent>
    </Dialog>
  );
}
