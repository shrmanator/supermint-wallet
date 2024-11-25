import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, Frame, Wallet } from "lucide-react";
import { useState } from "react";
import { Nft } from "@/alchemy/nft-types";
import { NFTMediaContent } from "@/app/wallet/nft-media-display";

interface NewNftModalProps {
  isOpen: boolean;
  onClose: () => void;
  nfts: Nft[];
}

export function NewNftModal({ isOpen, onClose, nfts }: NewNftModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalNfts = nfts?.length ?? 0;
  const currentNft = nfts?.[currentIndex];
  const isLastNft = currentIndex === totalNfts - 1;

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
      <DialogContent className="w-[95vw] max-w-6xl p-0 h-[95vh] max-h-[900px] bg-background rounded-xl overflow-hidden flex flex-col">
        {/* Gallery Header */}
        <div className="h-12 bg-background flex items-center justify-between px-4 border-b">
          <div className="flex items-center gap-2">
            <Frame className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium">Gallery View</span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col md:grid md:grid-cols-5 flex-1 overflow-hidden">
          {/* Art Display Section */}
          <div className="md:col-span-3 h-[40vh] sm:h-[50vh] md:h-full bg-black flex items-center justify-center">
            <div className="w-full h-full p-2 sm:p-3 md:p-4">
              <div className="w-full h-full relative">
                <div className="absolute inset-0 rounded-lg" />
                <div className="absolute inset-1 sm:inset-2 bg-black rounded-lg overflow-hidden">
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

          {/* Information Panel */}
          <Card className="md:col-span-2 border-none rounded-none flex-1 md:h-full overflow-hidden flex flex-col">
            <CardContent className="flex-1 p-4 sm:p-6 overflow-hidden flex flex-col">
              {/* Fixed Content */}
              <div className="space-y-4">
                {supermintData?.charityName && (
                  <Badge
                    variant="secondary"
                    className="uppercase text-xs tracking-wider"
                  >
                    {supermintData.charityName}
                  </Badge>
                )}

                <h2 className="text-xl sm:text-2xl font-serif">
                  {currentNft?.name?.replace(/#\d+/, "") || "Untitled NFT"}
                </h2>

                <Separator className="my-4" />
              </div>

              {/* Scrollable Description */}
              <div className="flex-1 min-h-0">
                <div className="h-full overflow-y-auto pr-2">
                  <div className="prose prose-sm text-muted-foreground">
                    <p>
                      {currentNft?.description || "No description available"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>

            {/* Navigation Footer */}
            <div className="border-t bg-background p-4 sm:p-6">
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
                  onClick={() => (isLastNft ? onClose() : navigate("next"))}
                  className="w-full"
                >
                  {isLastNft ? (
                    <>
                      Go to Wallet
                      <Wallet className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>

              {/* Progress Indicator */}
              <div className="text-center text-sm text-muted-foreground mt-4">
                {currentIndex + 1} of {totalNfts}
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
