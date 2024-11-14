import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle2, CircleSlash2, ChevronRight } from "lucide-react";
import NftCard from "@/components/nft-card/nft-card";
import { Progress } from "@/components/ui/progress";
import UnclaimedNftCard from "./unclaimed-nft-card";
import CondensedUnclaimedNftCard from "./unclaimed-nft-card-condensed";
import NftCardMini from "../nft-card/nft-card-mini";
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
  const displayCount = Math.min(2, nfts.length);
  const unknownCount = setSize - nfts.length;

  return (
    <Card className="shadow-md w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-muted-foreground font-normal text-md truncate">
            <span className="font-semibold">{setName}</span> by {charityName}
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

        <div className="grid grid-cols-3 gap-3">
          {nfts.slice(0, displayCount).map((nft) => (
            <div
              key={nft.tokenId}
              className="aspect-square w-full max-w-[140px] overflow-hidden"
            >
              <NftCard nft={nft} showMetadata={false} />
            </div>
          ))}
          {nfts.length < 2 && (
            <div className="w-full max-w-[140px] aspect-square flex items-center justify-center overflow-hidden">
              <CondensedUnclaimedNftCard charityName={charityName} />
            </div>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <div className="aspect-square w-full max-w-[140px] cursor-pointer overflow-hidden">
                <div className="h-full flex flex-col items-center justify-center bg-accent text-accent-foreground border border-transparent">
                  <ChevronRight size={20} />
                  <p className="mt-2 text-sm font-semibold leading-none">
                    View Full Set
                  </p>
                  <p className="text-xs mt-1">{setSize} NFTs</p>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle className="text-primary text-lg font-bold leading-tight">
                  {setName} Collection
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {nfts.map((nft) => (
                  <NftCardMini key={nft.tokenId} nft={nft} />
                ))}
                {Array.from({ length: unknownCount }).map((_, index) => (
                  <UnclaimedNftCard
                    key={`mystery-${index}`}
                    charityName={charityName}
                    backgroundImageUrl={"/images/question-mark.webp"}
                  />
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};
export default NftSet;
