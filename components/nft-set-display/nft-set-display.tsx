import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle2, ChevronRight, CircleSlash2 } from "lucide-react";
import { Nft } from "@/types/alchemy/nft-types";
import NftCard from "@/components/nft-card";
import UnclaimedNftCard from "@/components/nft-set-display/unclaimed-nft-card";
import { Progress } from "@/components/ui/progress";

interface NftCollectionDisplayProps {
  nfts: Nft[];
}

interface SetInfo {
  setName: string;
  nfts: Nft[];
  setSize: number;
  charityName: string;
}

const NftDisplay: React.FC<NftCollectionDisplayProps> = ({ nfts }) => {
  const groupedNfts = useMemo(() => {
    const sets: { [setName: string]: SetInfo } = {};
    const individual: Nft[] = [];

    nfts.forEach((nft) => {
      const setInfo = nft.raw.metadata.supermint;
      if (setInfo && setInfo.isInSet && setInfo.setName) {
        if (!sets[setInfo.setName]) {
          const setSizeAttribute = nft.raw.metadata.attributes.find(
            (attr) => attr.trait_type === "Set Size"
          );
          const setSize = setSizeAttribute ? Number(setSizeAttribute.value) : 0;
          sets[setInfo.setName] = {
            setName: setInfo.setName,
            nfts: [],
            setSize,
            charityName: setInfo.charityName,
          };
        }
        sets[setInfo.setName].nfts.push(nft);
      } else {
        individual.push(nft);
      }
    });

    return { sets, individual };
  }, [nfts]);

  const renderSetCard = (setInfo: SetInfo) => {
    const isComplete = setInfo.nfts.length === setInfo.setSize;
    const displayCount = 4;
    const mysteryCount = Math.min(setInfo.setSize - setInfo.nfts.length, 3);
    const totalDisplayed = Math.min(
      displayCount,
      setInfo.nfts.length + mysteryCount
    );
    const progressPercentage = (setInfo.nfts.length / setInfo.setSize) * 100;

    return (
      <Card
        key={setInfo.setName}
        className="overflow-hidden shadow-lg rounded-lg bg-card-background"
      >
        <CardHeader className="pb-2 border-b border-border">
          <div className="flex justify-between items-center">
            <CardTitle className="text-primary font-semibold text-lg">
              Set: {setInfo.setName}
            </CardTitle>
            <Badge
              variant="default"
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                isComplete
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {isComplete ? (
                <>
                  <CheckCircle2 size={16} className="text-green-500" /> Set
                  Complete
                </>
              ) : (
                <>
                  <CircleSlash2 size={16} className="text-secondary" /> Set
                  Incomplete
                </>
              )}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            By {setInfo.charityName}
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mt-3 mb-2">
            Collected {setInfo.nfts.length} / {setInfo.setSize} NFTs
          </p>

          {/* Progress bar with conditional color */}
          <Progress
            className={`mb-4 ${isComplete ? "bg-green-500" : ""}`}
            value={progressPercentage}
          />

          <div className="grid grid-cols-3 gap-2">
            {setInfo.nfts.slice(0, displayCount).map((nft) => (
              <div
                key={nft.tokenId}
                className="aspect-square bg-card-muted border rounded-md shadow-sm"
              >
                <NftCard nft={nft} compact />
              </div>
            ))}
            {Array.from({ length: mysteryCount }).map((_, index) => (
              <div
                key={`mystery-${index}`}
                className="aspect-square border rounded-md flex items-center justify-center bg-card-muted-alt shadow-sm"
              >
                <UnclaimedNftCard
                  charityName={setInfo.charityName}
                  backgroundImageUrl={"/images/question-mark.webp"}
                />
              </div>
            ))}
          </div>

          {setInfo.setSize > totalDisplayed && (
            <div className="mt-4 text-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-primary">
                    View Full Set <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl bg-card-background">
                  <DialogHeader>
                    <DialogTitle className="text-primary">
                      {setInfo.setName} Collection
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    {setInfo.nfts.map((nft) => (
                      <NftCard key={nft.tokenId} nft={nft} />
                    ))}
                    {Array.from({
                      length: setInfo.setSize - setInfo.nfts.length,
                    }).map((_, index) => (
                      <UnclaimedNftCard
                        key={`mystery-full-${index}`}
                        charityName={setInfo.charityName}
                        backgroundImageUrl={"/images/question-mark.webp"}
                      />
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.values(groupedNfts.sets).map(renderSetCard)}
      </div>

      {groupedNfts.individual.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Individual NFTs</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {groupedNfts.individual.map((nft) => (
              <NftCard key={nft.tokenId} nft={nft} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NftDisplay;
