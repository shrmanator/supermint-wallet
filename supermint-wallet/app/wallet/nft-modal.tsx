import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Frame, X, Diamond } from "lucide-react";
import { Nft } from "@/alchemy/nft-types";
import { NFTMediaContent } from "@/components/nft-media-content";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NftModalProps {
  isOpen: boolean;
  onClose: () => void;
  nft: Nft;
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

export function NftModal({ isOpen, onClose, nft }: NftModalProps) {
  if (!nft) return null;

  const { supermint } = nft.raw.metadata;
  const displayCount = supermint
    ? `${supermint.seriesNumber} of ${supermint.totalNftsInSeries}`
    : null;

  const rarityInfo = supermint?.totalNftsInSeries
    ? getRarityInfo(supermint.totalNftsInSeries)
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-6xl p-0 h-[90vh] md:h-[95vh] max-h-[800px] bg-background rounded-xl overflow-hidden flex flex-col">
        <div className="h-10 md:h-12 bg-background flex items-center justify-between px-3 md:px-4 border-b">
          <div className="flex items-center gap-2">
            <Frame className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
            <span className="text-sm font-medium">NFT Details</span>
          </div>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-5 flex-1 overflow-hidden">
          <div className="md:col-span-3 h-[35vh] sm:h-[40vh] md:h-full bg-black flex items-center justify-center">
            <div className="w-full h-full p-2 sm:p-3 md:p-4">
              <div className="w-full h-full relative">
                <div className="absolute inset-0 rounded-lg" />
                <div className="absolute inset-1 sm:inset-2 bg-black rounded-lg overflow-hidden">
                  <NFTMediaContent
                    nft={nft}
                    layout="full"
                    showSeriesNumber={false}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          <Card className="md:col-span-2 border-none rounded-none flex-1 md:h-full overflow-hidden flex flex-col">
            <CardContent className="flex-1 p-3 sm:p-4 md:p-6 overflow-hidden flex flex-col">
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
                  <h3 className="text-sm font-medium mb-2">NFT Rarity Level</h3>
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

              <ScrollArea className="flex-1">
                <div className="prose prose-sm text-muted-foreground pr-4">
                  <p>{nft?.description || "No description available"}</p>
                </div>
              </ScrollArea>
            </CardContent>

            <div className="border-t bg-background p-3 sm:p-4 md:p-6">
              <Button variant="outline" onClick={onClose} className="w-full">
                Close
                <X className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default NftModal;
