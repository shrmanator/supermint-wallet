import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, X, Frame } from "lucide-react";
import { useState } from "react";
import { NFTMediaContent } from "@/components/nft-media-display";

// Keeping the same props interface
interface NewNftModalProps {
  isOpen: boolean;
  onClose: () => void;
  nfts: Nft[];
}

export function NewNftModal({ isOpen, onClose, nfts }: NewNftModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalNfts = nfts?.length ?? 0;
  const currentNft = nfts?.[currentIndex];

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
      <DialogContent className="max-w-7xl p-0 bg-background rounded-xl overflow-hidden">
        {/* Gallery Header */}
        <div className="relative h-12 bg-background flex items-center justify-between px-4 border-b">
          <div className="flex items-center gap-2">
            <Frame className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium">Gallery View</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 absolute right-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-0 h-[80vh]">
          {/* Main Art Display (3/5 width on medium+ screens) */}
          <div className="relative md:col-span-3 h-full bg-black">
            <div className="absolute inset-6">
              <div className="w-full h-full relative">
                {/* Decorative Frame Effect */}
                <div className="absolute inset-0 border-2 border-neutral-800 rounded-lg" />
                <div className="absolute inset-2 bg-black rounded-lg overflow-hidden">
                  <NFTMediaContent
                    nft={currentNft}
                    layout="full"
                    showSeriesNumber={false}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Art Information Panel (2/5 width on medium+ screens) */}
          <Card className="md:col-span-2 border-none rounded-none h-full overflow-y-auto">
            <CardContent className="p-6 space-y-6">
              {/* Gallery Plaque */}
              <div className="space-y-4">
                {supermintData?.charityName && (
                  <Badge
                    variant="secondary"
                    className="uppercase text-xs tracking-wider"
                  >
                    {supermintData.charityName}
                  </Badge>
                )}

                <h2 className="text-2xl font-serif">
                  {currentNft?.name?.replace(/#\d+/, "") || "Untitled NFT"}
                </h2>

                <Separator className="my-4" />

                <div className="prose prose-sm text-muted-foreground">
                  <p>{currentNft?.description || "No description available"}</p>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent md:relative md:bg-none">
                <div className="flex justify-between items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate("prev")}
                    disabled={currentIndex === 0}
                    className="w-full"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("next")}
                    disabled={currentIndex === totalNfts - 1}
                    className="w-full"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                {/* Progress Indicator */}
                <div className="text-center text-sm text-muted-foreground mt-4">
                  {currentIndex + 1} of {totalNfts}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
