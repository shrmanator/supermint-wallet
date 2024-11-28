import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, CircleSlash2 } from "lucide-react";
import NftCard from "@/components/nft-card/nft-card";
import { Progress } from "@/components/ui/progress";
import CondensedUnclaimedNftCard from "./unclaimed-nft-card-condensed";
import { cn } from "@/lib/utils";
import { Nft } from "@/alchemy/nft-types";

interface NftSetProps {
  nfts: Nft[];
  setSize: number;
  charityName: string;
  setName: string;
  duplicateCounts?: Map<string, number>;
}

const NftSet: React.FC<NftSetProps> = ({
  nfts,
  setSize,
  charityName,
  setName,
  duplicateCounts = new Map(),
}) => {
  const uniqueLength = nfts.length;
  const isComplete = uniqueLength === setSize;
  const progressPercentage = (uniqueLength / setSize) * 100;
  const unknownCount = setSize - uniqueLength;

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-muted-foreground font-normal text-md truncate">
            <span className="text-muted-foreground">{setName}</span>
            <span className="text-muted-foreground mx-1 font-light">by</span>
            <span className="font-regular text-primary">{charityName}</span>
          </CardTitle>
          <Badge
            variant={isComplete ? "default" : "secondary"}
            className="flex items-center gap-1"
          >
            {isComplete ? (
              <>
                <CheckCircle2 size={14} /> Set Complete
              </>
            ) : (
              <>
                <CircleSlash2 size={14} /> Incomplete Set
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mt-2 mb-3 font-light">
          Collected {uniqueLength} / {setSize} series from this set
        </p>

        <Progress
          value={progressPercentage}
          className={cn("mb-4", isComplete ? "text-success" : "text-muted")}
        />

        <div className="grid grid-cols-4 gap-3">
          {nfts.map((nft) => (
            <div key={nft.tokenId} className="aspect-square overflow-hidden">
              <NftCard
                nft={nft}
                showMetadata={false}
                duplicateCount={duplicateCounts.get(nft.tokenId) || 1}
              />
            </div>
          ))}
          {Array.from({ length: unknownCount }).map((_, index) => (
            <div
              key={`unclaimed-${index}`}
              className="aspect-square flex items-center justify-center overflow-hidden"
            >
              <CondensedUnclaimedNftCard charityName={charityName} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NftSet;
