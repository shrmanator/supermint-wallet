import React from "react";
import NftCard from "@/components/nft-card/nft-card";
import { Progress } from "@/components/ui/progress";
import CondensedUnclaimedNftCard from "./unclaimed-nft-card-condensed";
import { cn } from "@/lib/utils";
import { Nft } from "@/alchemy/nft-types";
import { useCharityUrl } from "@/contexts/charity-context";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
  const charityUrl = useCharityUrl(charityName);
  const normalizedCharityUrl = charityUrl?.startsWith("http")
    ? charityUrl
    : `https://${charityUrl}`;

  return (
    <Card className="mb-4 bg-black/40 border-white/10">
      <CardHeader className="space-y-2 pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-white">{setName}</h3>
            <div className="text-sm text-white/60">
              {charityUrl ? (
                <a
                  href={normalizedCharityUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white/90 transition-colors"
                >
                  {charityName}
                </a>
              ) : (
                <span>{charityName}</span>
              )}
            </div>
          </div>
          <Badge variant={isComplete ? "default" : "secondary"} className="h-6">
            {isComplete ? "Complete" : "Incomplete"}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-white/60">
            {uniqueLength} / {setSize} collected
          </div>
          <Progress
            value={progressPercentage}
            className={cn(
              "h-1",
              isComplete ? "[&>div]:bg-white" : "bg-white/10 [&>div]:bg-white"
            )}
          />
        </div>
      </CardHeader>

      <Separator className="bg-white/10" />
      <CardContent className="pt-4">
        {/* Horizontal Scrolling Container for Mobile */}
        <div className="overflow-x-auto sm:overflow-visible">
          <div className="flex gap-3 sm:grid sm:grid-cols-4">
            {nfts.map((nft) => (
              <div
                key={nft.tokenId}
                className="aspect-square min-w-[140px] sm:min-w-0 overflow-hidden"
              >
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
                className="aspect-square flex items-center justify-center min-w-[140px] sm:min-w-0 overflow-hidden"
              >
                <CondensedUnclaimedNftCard charityName={charityName} />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NftSet;
