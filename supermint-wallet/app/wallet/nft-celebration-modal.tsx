import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, Wallet, Diamond } from "lucide-react";
import { useState, useEffect } from "react";
import { Nft } from "@/alchemy/nft-types";
import Confetti from "react-confetti";
import { NFTMediaContent } from "@/components/nft-media-content";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NftCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  nfts: Nft[];
}

const getRarityInfo = (totalSupply: number) => {
  if (totalSupply <= 100) {
    return { label: "Legendary", stars: "⭐⭐⭐⭐", color: "text-yellow-400" };
  } else if (totalSupply <= 500) {
    return { label: "Epic", stars: "⭐⭐⭐", color: "text-purple-500" };
  } else if (totalSupply <= 1000) {
    return { label: "Rare", stars: "⭐⭐", color: "text-blue-500" };
  }
  return { label: "Common", stars: "⭐", color: "text-gray-500" };
};

export function NftCelebrationModal({
  isOpen,
  onClose,
  nfts,
}: NftCelebrationModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const totalNfts = nfts?.length ?? 0;
  const currentNft = nfts?.[currentIndex];
  const isLastNft = currentIndex === totalNfts - 1;

  if (!nfts?.length || !currentNft) return null;

  const navigate = (direction: "prev" | "next") => {
    const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < totalNfts) {
      setCurrentIndex(newIndex);
    }
  };

  const { supermint } = currentNft?.raw?.metadata;
  const charityName = supermint?.charityName || "this organization";
  const displayCount = supermint
    ? `${supermint.seriesNumber} of ${supermint.totalNftsInSeries}`
    : null;

  const rarityInfo = supermint?.totalNftsInSeries
    ? getRarityInfo(supermint.totalNftsInSeries)
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-6xl p-0 h-[90vh] md:h-[95vh] max-h-[800px] bg-background rounded-xl overflow-hidden flex flex-col">
        <DialogTitle className="sr-only">NFT Celebration View</DialogTitle>
        <div className="relative flex flex-col h-full overflow-hidden">
          {showConfetti && (
            <Confetti
              width={800}
              height={800}
              recycle={false}
              numberOfPieces={250}
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          )}

          <div className="bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 flex-shrink-0">
            <div className="px-3 py-3 md:px-6 md:py-5 flex flex-col items-center justify-center bg-black/10">
              <div className="flex items-center gap-2 text-white max-w-full">
                <h1 className="text-sm md:text-xl font-medium leading-tight">
                  Congratulations on your NFT from {charityName}!
                </h1>
              </div>
              <p className="text-purple-100 text-xs md:text-sm mt-1 md:mt-2 text-center">
                Your generosity is appreciated.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:grid md:grid-cols-5 flex-1 min-h-0">
            <div className="md:col-span-3 h-[35vh] sm:h-[40vh] md:h-full bg-black flex items-center justify-center">
              <div className="w-full h-full p-2 sm:p-3 md:p-4">
                <div className="w-full h-full relative">
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

            <Card className="md:col-span-2 border-none rounded-none flex-1 overflow-hidden flex flex-col">
              <CardContent className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto flex flex-col">
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between">
                    {supermint?.charityName && (
                      <Badge
                        variant="secondary"
                        className="uppercase text-xs tracking-wider"
                      >
                        {supermint.charityName}
                      </Badge>
                    )}
                  </div>

                  <div className="bg-muted/50 rounded-lg p-3">
                    <h3 className="text-sm font-medium mb-2">
                      NFT Rarity Level
                    </h3>
                    <div className="flex items-center gap-4">
                      {rarityInfo && (
                        <div className="flex items-center gap-1.5">
                          <Diamond className={`w-4 h-4 ${rarityInfo.color}`} />
                          <span className="text-sm font-medium">
                            {rarityInfo.label} {rarityInfo.stars}
                          </span>
                        </div>
                      )}
                      {displayCount && (
                        <span className="text-sm text-muted-foreground border-l pl-4">
                          {displayCount}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      The rarity of this NFT is determined by the total supply
                      available in the series.
                    </p>
                  </div>

                  <h2 className="text-lg sm:text-xl md:text-2xl font-serif">
                    {supermint?.seriesTitle || "Untitled NFT"}
                  </h2>
                  <div className="text-sm text-muted-foreground">
                    Artist: {supermint?.seriesArtistName || "Unknown Artist"}
                  </div>
                  <Separator className="my-2 md:my-4" />
                </div>

                <ScrollArea className="max-h-40 overflow-y-auto">
                  <div className="prose prose-sm text-muted-foreground">
                    <p>
                      {currentNft?.description || "No description available"}
                    </p>
                  </div>
                </ScrollArea>
              </CardContent>

              <div className="border-t bg-background p-3 sm:p-4 md:p-6">
                <div className="flex justify-between items-center gap-3 md:gap-4">
                  {totalNfts > 1 ? (
                    <>
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
                        onClick={() =>
                          isLastNft ? onClose() : navigate("next")
                        }
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
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="w-full"
                    >
                      Go to Wallet
                      <Wallet className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
                {totalNfts > 1 && (
                  <div className="text-center text-sm text-muted-foreground mt-3 md:mt-4">
                    {currentIndex + 1} of {totalNfts}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
