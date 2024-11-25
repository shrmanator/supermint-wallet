import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { Nft } from "@/alchemy/nft-types";
import { NFTMediaContent } from "@/app/wallet/nft-media-display";
import Confetti from "react-confetti";

interface NftCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  nfts: Nft[];
}

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-6xl p-0 h-[95vh] max-h-[900px] bg-background rounded-xl overflow-hidden flex flex-col">
        <DialogTitle className="sr-only">NFT Celebration View</DialogTitle>
        <div className="relative flex flex-col h-full overflow-hidden">
          {showConfetti && (
            <Confetti
              width={800}
              height={900}
              recycle={false}
              numberOfPieces={200}
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          )}

          <div className="bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 flex-shrink-0">
            <div className="px-4 py-4 md:px-6 md:py-5 flex flex-col items-center justify-center bg-black/10">
              <div className="flex items-center gap-2 text-white max-w-full">
                <h1 className="text-sm md:text-xl font-medium leading-tight">
                  Congratulations on your NFT from {charityName}!
                </h1>
              </div>
              <p className="text-purple-100 text-xs md:text-sm mt-2 text-center">
                Your generosity is appreciated.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:grid md:grid-cols-5 flex-1 min-h-0">
            <div className="md:col-span-3 h-[40vh] sm:h-[50vh] md:h-full bg-black flex items-center justify-center">
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
              <CardContent className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    {supermint?.charityName && (
                      <Badge
                        variant="secondary"
                        className="uppercase text-xs tracking-wider"
                      >
                        {supermint.charityName}
                      </Badge>
                    )}
                    {displayCount && (
                      <span className="text-sm text-muted-foreground">
                        {displayCount}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-serif">
                    {supermint?.seriesTitle || "Untitled NFT"}
                  </h2>
                  <div className="text-sm text-muted-foreground">
                    Artist: {supermint?.seriesArtistName || "Unknown Artist"}
                  </div>
                  <Separator className="my-4" />
                </div>

                <div className="flex-1 min-h-0">
                  <div className="prose prose-sm text-muted-foreground">
                    <p>
                      {currentNft?.description || "No description available"}
                    </p>
                  </div>
                </div>
              </CardContent>

              <div className="border-t bg-background p-4 sm:p-6">
                <div className="flex justify-between items-center gap-4">
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
                  <div className="text-center text-sm text-muted-foreground mt-4">
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
