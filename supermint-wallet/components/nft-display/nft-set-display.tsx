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
          <Badge
            variant="outline"
            className={cn(
              "h-6 font-semibold",
              isComplete
                ? "bg-gradient-to-r from-yellow-500/30 via-emerald-500/30 to-blue-500/30 text-white border-yellow-500/50"
                : "bg-white/10 text-white/60 border-white/20"
            )}
          >
            {isComplete ? "✨ Set Complete! ✨" : "Set Incomplete"}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-white/60">
            Collected {uniqueLength} / {setSize} from this set
          </div>
          <Progress
            value={progressPercentage}
            className={cn(
              "h-1",
              isComplete
                ? "bg-black/40 [&>div]:bg-gradient-to-r [&>div]:from-yellow-500 [&>div]:via-emerald-500 [&>div]:to-blue-500"
                : "bg-white/10 [&>div]:bg-white/20"
            )}
          />
        </div>
      </CardHeader>

      <Separator className="bg-white/10" />
      <CardContent className="pt-4">
        <div className="overflow-x-auto touch-pan-x sm:overflow-visible px-1">
          <div className="flex gap-3 sm:grid sm:grid-cols-4 min-w-fit sm:min-w-0 scroll-smooth">
            {nfts.map((nft) => (
              <div
                key={nft.tokenId}
                className="w-[140px] aspect-square sm:w-auto"
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
                className="w-[140px] aspect-square sm:w-auto flex items-center justify-center"
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
