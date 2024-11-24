import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Nft } from "@/alchemy/nft-types";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NFTMediaContent } from "@/components/nft-media-display";

interface NewNftModalProps {
  isOpen: boolean;
  onClose: () => void;
  nfts: Nft[];
}

export function NewNftModal({ isOpen, onClose, nfts }: NewNftModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Make sure we have valid nfts array and current NFT
  const totalNfts = nfts?.length ?? 0;
  const currentNft = nfts?.[currentIndex];

  // Guard clause - if no NFTs, don't render the modal
  if (!nfts?.length || !currentNft) {
    return null;
  }

  const navigate = (direction: "prev" | "next") => {
    const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < totalNfts) {
      setCurrentIndex(newIndex);
    }
  };

  const metadata = currentNft?.raw?.metadata;
  const supermintData = metadata?.supermint;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[500px] p-0 overflow-hidden">
        <div className="relative">
          {/* Large Image Section */}
          <div className="w-full aspect-square relative">
            <NFTMediaContent
              nft={currentNft}
              layout="bottom"
              showSeriesNumber={true}
            />

            {/* Navigation Overlay */}
            <div className="absolute inset-0 flex items-center justify-between px-4">
              <Button
                variant="outline"
                size="icon"
                className="bg-background/80 backdrop-blur-sm"
                onClick={() => navigate("prev")}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="bg-background/80 backdrop-blur-sm"
                onClick={() => navigate("next")}
                disabled={currentIndex === totalNfts - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Info Section */}
          <div className="p-6 space-y-4">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle className="text-xl font-bold">
                  {currentNft?.name || "Untitled NFT"}
                </DialogTitle>
                <Badge variant="secondary">
                  {currentIndex + 1}/{totalNfts}
                </Badge>
              </div>
              {supermintData?.charityName && (
                <Badge variant="outline" className="mt-2">
                  {supermintData.charityName}
                </Badge>
              )}
              {supermintData?.seriesTitle && (
                <DialogDescription className="mt-2">
                  {supermintData.seriesTitle}
                </DialogDescription>
              )}
            </DialogHeader>

            <p className="text-sm text-muted-foreground">
              {currentNft?.description || "No description available"}
            </p>
          </div>

          {/* Footer */}
          <DialogFooter className="p-6 pt-0">
            <Button
              onClick={
                currentIndex === totalNfts - 1
                  ? onClose
                  : () => navigate("next")
              }
              className="w-full"
            >
              {currentIndex === totalNfts - 1 ? "Done 🎉" : "Next NFT →"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
