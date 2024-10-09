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
import { Nft } from "@/types/alchemy/nft-types";
import NftCard from "@/components/nft-card";
import { Progress } from "@/components/ui/progress";
import UnclaimedNftCard from "./unclaimed-nft-card";
import CondensedUnclaimedNftCard from "./unclaimed-nft-card-condensed";

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
    <Card className="shadow-lg rounded-lg bg-card-background w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-muted-foreground font-semibold text-lg truncate">
            Set: <span className="font-bold">{setName}</span>, By {charityName}
          </CardTitle>
          <Badge
            variant="default"
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
              isComplete
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {isComplete ? (
              <>
                <CheckCircle2 size={16} className="text-green-500" /> Complete
              </>
            ) : (
              <>
                <CircleSlash2 size={16} className="text-secondary" /> Incomplete
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-base text-muted-foreground mt-3 mb-2">
          Collected {nfts.length} / {setSize} NFTs
        </p>

        <Progress
          className={`mb-4 ${isComplete ? "bg-green-500" : ""}`}
          value={progressPercentage}
        />

        <div className="grid grid-cols-3 gap-4">
          {nfts.slice(0, displayCount).map((nft) => (
            <div
              key={nft.tokenId}
              className="aspect-square w-full max-w-[160px]"
            >
              <NftCard nft={nft} showMetadata={false} />
            </div>
          ))}
          {nfts.length < 2 && (
            <div className="w-full max-w-[160px] aspect-square flex items-center justify-center">
              <CondensedUnclaimedNftCard charityName={charityName} />
            </div>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <div className="aspect-square w-full max-w-[160px] cursor-pointer">
                <Card className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  <ChevronRight size={24} />
                  <p className="mt-2 text-base font-semibold">View Full Set</p>
                  <p className="text-xs mt-1">{setSize} NFTs</p>
                </Card>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl bg-card-background">
              <DialogHeader>
                <DialogTitle className="text-primary text-xl font-bold">
                  {setName} Collection
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {nfts.map((nft) => (
                  <NftCard key={nft.tokenId} nft={nft} />
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
