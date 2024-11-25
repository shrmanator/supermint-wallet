import { Dialog, DialogContent } from "@/components/ui/dialog";
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

  const metadata = currentNft?.raw?.metadata;
  const supermintData = metadata?.supermint;
  const charityName = supermintData?.charityName || "this organization";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-6xl p-0 h-[95vh] max-h-[900px] bg-background rounded-xl overflow-hidden">
        <div className="relative flex flex-col h-full">
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

          {/* Celebration Header */}
          <div className="bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 flex-shrink-0">
            <div className="px-4 py-3 md:px-6 md:py-4 flex flex-col items-center justify-center bg-black/10">
              <div className="flex items-center gap-2 text-white">
                <h1 className="text-base md:text-xl font-medium leading-tight">
                  Congratulations! You&apos;ve received an NFT from{" "}
                  {charityName}!
                </h1>
              </div>
              <p className="text-purple-100 text-xs md:text-sm mt-1">
                Your contribution has been commemorated as a unique digital
                collectible
              </p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex flex-col md:grid md:grid-cols-5 flex-1 min-h-0">
            {/* Art Display Section */}
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

            {/* Information Panel */}
            <Card className="md:col-span-2 border-none rounded-none flex-1 overflow-hidden flex flex-col">
              <CardContent className="flex-1 p-4 sm:p-6 overflow-hidden flex flex-col">
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
                  <div className="text-sm text-muted-foreground">
                    Token ID: {currentNft?.tokenId}
                  </div>
                  <Separator className="my-4" />
                </div>

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
