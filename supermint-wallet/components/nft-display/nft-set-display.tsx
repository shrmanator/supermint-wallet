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
  const progressPercentage = (nfts.length / setSize) * 100;
  const unknownCount = setSize - nfts.length;

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-muted-foreground font-normal text-md truncate">
            <span className="font-semibold">{setName}</span> by{" "}
            <span className="font-regular text-primary">{charityName}</span>
          </CardTitle>
          <Badge
            variant={isComplete ? "default" : "secondary"}
            className="flex items-center gap-1"
          >
            {isComplete ? (
              <>
                <CheckCircle2 size={14} /> Complete
              </>
            ) : (
              <>
                <CircleSlash2 size={14} /> Incomplete
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mt-2 mb-3 font-light">
          Collected {nfts.length} / {setSize} NFTs
        </p>

        <Progress
          value={progressPercentage}
          className={cn("mb-4", isComplete ? "text-success" : "text-muted")}
        />

        <div className="grid grid-cols-4 gap-3">
          {nfts.map((nft) => (
            <div key={nft.tokenId} className="aspect-square overflow-hidden">
              <NftCard nft={nft} showMetadata={false} />
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
