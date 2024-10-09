import React from "react";
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
import { Progress } from "@/components/ui/progress";
import UnclaimedNftCard from "./unclaimed-nft-card";

interface NftSetProps {
  setName: string;
  nfts: Nft[];
  setSize: number;
  charityName: string;
}

const NftSet: React.FC<NftSetProps> = ({
  setName,
  nfts,
  setSize,
  charityName,
}) => {
  const isComplete = nfts.length === setSize;
  const displayCount = 4;
  const mysteryCount = Math.min(setSize - nfts.length, 3);
  const totalDisplayed = Math.min(displayCount, nfts.length + mysteryCount);
  const progressPercentage = (nfts.length / setSize) * 100;

  return (
    <Card className="overflow-hidden shadow-lg rounded-lg bg-card-background">
      <CardHeader className="pb-2 border-b border-border">
        <div className="flex justify-between items-center">
          <CardTitle className="text-primary font-semibold text-lg">
            Set: {setName}
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
        <p className="text-sm text-muted-foreground mt-1">By {charityName}</p>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mt-3 mb-2">
          Collected {nfts.length} / {setSize} NFTs
        </p>

        <Progress
          className={`mb-4 ${isComplete ? "bg-green-500" : ""}`}
          value={progressPercentage}
        />

        <div className="grid grid-cols-3 gap-2">
          {nfts.slice(0, displayCount).map((nft) => (
            <div
              key={nft.tokenId}
              className="aspect-square bg-card-muted border rounded-md shadow-sm"
            >
              <NftCard nft={nft} />
            </div>
          ))}
          {Array.from({ length: mysteryCount }).map((_, index) => (
            <div
              key={`mystery-${index}`}
              className="aspect-square border rounded-md flex items-center justify-center bg-card-muted-alt shadow-sm"
            >
              <UnclaimedNftCard
                charityName={charityName}
                backgroundImageUrl={"/images/question-mark.webp"}
              />
            </div>
          ))}
        </div>

        {setSize > totalDisplayed && (
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
                    {setName} Collection
                  </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                  {nfts.map((nft) => (
                    <NftCard key={nft.tokenId} nft={nft} />
                  ))}
                  {Array.from({
                    length: setSize - nfts.length,
                  }).map((_, index) => (
                    <UnclaimedNftCard
                      key={`mystery-full-${index}`}
                      charityName={charityName}
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

export default NftSet;
