import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Frame, X } from "lucide-react";
import { Nft } from "@/alchemy/nft-types";
import { NFTMediaContent } from "@/app/wallet/nft-media-display";

interface NftModalProps {
  isOpen: boolean;
  onClose: () => void;
  nft: Nft;
}

export function NftModal({ isOpen, onClose, nft }: NftModalProps) {
  if (!nft) return null;

  const { supermint } = nft.raw.metadata;
  const displayCount = supermint
    ? `${supermint.seriesNumber} of ${supermint.totalNftsInSeries}`
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-6xl p-0 h-[95vh] max-h-[900px] bg-background rounded-xl overflow-hidden flex flex-col">
        <div className="h-12 bg-background flex items-center justify-between px-4 border-b">
          <div className="flex items-center gap-2">
            <Frame className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium">NFT Details</span>
          </div>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-5 flex-1 overflow-hidden">
          <div className="md:col-span-3 h-[40vh] sm:h-[50vh] md:h-full bg-black flex items-center justify-center">
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
            <CardContent className="flex-1 p-4 sm:p-6 overflow-hidden flex flex-col">
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

                <Separator className="my-4" />
              </div>

              <div className="flex-1 min-h-0">
                <div className="h-full overflow-y-auto pr-2">
                  <div className="prose prose-sm text-muted-foreground">
                    <p>{nft?.description || "No description available"}</p>
                  </div>
                </div>
              </div>
            </CardContent>

            <div className="border-t bg-background p-4 sm:p-6">
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
