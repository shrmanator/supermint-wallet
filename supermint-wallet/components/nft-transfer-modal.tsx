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
import { useActiveAccount } from "thirdweb/react";
import { Nft } from "@/alchemy/nft-types";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { NFTMediaContent } from "@/components/nft-media-content";

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  nft: Nft;
}

export function TransferModal({ isOpen, onClose, nft }: TransferModalProps) {
  const [toAddress, setToAddress] = useState("");
  const [isSent, setIsSent] = useState(false);
  const { transferERC1155, status, error } = useTransferERC1155();
  const account = useActiveAccount();
  const { toast } = useToast();

  const handleTransfer = async () => {
    console.log("Transfer initiated", {
      toAddress,
      tokenId: nft.tokenId,
      account,
    });

    if (!account?.address) {
      console.warn("No wallet connected", { account });
      toast({
        variant: "destructive",
        title: "Wallet Not Connected",
        description: "Please connect your wallet to send NFTs.",
      });
      return;
    }

    if (!toAddress?.trim()) {
      console.warn("No recipient address provided");
      toast({
        variant: "destructive",
        title: "Missing Address",
        description: "Please enter a recipient wallet address.",
      });
      return;
    }

    try {
      console.log("Starting ERC1155 transfer", {
        from: account.address,
        to: toAddress,
        tokenId: nft.tokenId,
      });

      await transferERC1155({
        toAddress: toAddress.trim(),
        tokenId: BigInt(nft.tokenId),
      });

      console.log("Sending completed successfully");
      setIsSent(true);

      toast({
        title: "Send Initiated",
        description: `NFT sent to ${toAddress.slice(0, 6)}...${toAddress.slice(
          -4
        )}. Changes will take effect in about a minute, you can close this window.`,
      });
    } catch (err) {
      console.error("Transfer failed with error:", err);

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to send NFT. Please try again.";

      toast({
        variant: "destructive",
        title: "Sending Failed",
        description: errorMessage,
      });
    }
  };

  console.log("TransferModal rendered", {
    isOpen,
    nftId: nft.tokenId,
    nftName: nft.name,
    accountConnected: !!account,
    isSent,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{isSent ? "NFT Sent!" : "Send NFT"}</DialogTitle>
          <DialogDescription className="space-y-1">
            {isSent ? (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>
                  Sent to {toAddress.slice(0, 6)}...{toAddress.slice(-4)}. Your
                  NFT is on its way. Changes will take effect in about a minute.
                </span>
              </div>
            ) : (
              <>
                Send this NFT to another wallet address
                {account && (
                  <p className="text-xs font-medium">
                    Your wallet address is {account.address.slice(0, 6)}...
                    {account.address.slice(-4)}
                  </p>
                )}
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="overflow-hidden rounded-lg bg-muted/50">
            <div className="aspect-square w-full">
              <NFTMediaContent
                nft={nft}
                showSeriesNumber={true}
                layout="full"
                className="w-full h-full"
              />
            </div>
            <div className="px-3 py-2 border-t border-muted">
              <h3 className="font-medium">
                {(nft.name || "Untitled NFT").replace(/ #\d+$/, "")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {(
                  nft.raw?.metadata?.supermint?.charityName || "Unknown Charity"
                ).replace(/ #\d+$/, "")}
              </p>
            </div>
          </div>

          {!isSent ? (
            <div className="space-y-2">
              <div className="relative">
                <Input
                  placeholder="Recipient's wallet address"
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                />
              </div>
              {toAddress && (
                <p className="text-xs text-muted-foreground px-2">
                  To: {toAddress.slice(0, 6)}...{toAddress.slice(-4)}
                </p>
              )}
            </div>
          ) : null}
        </div>

        <DialogFooter className="sm:justify-between gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              console.log("Modal closed");
              onClose();
            }}
          >
            {isSent ? "Close" : "Cancel"}
          </Button>
          {!isSent && (
            <Button
              onClick={handleTransfer}
              disabled={status === "pending"}
              className="min-w-20"
            >
              {status === "pending" ? "Sending..." : "Send"}
            </Button>
          )}
        </DialogFooter>

        {error && (
          <p className="text-sm text-destructive mt-2">
            {error instanceof Error ? error.message : "Sending failed"}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
