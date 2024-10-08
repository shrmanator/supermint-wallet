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
import { CheckCircle2, LockIcon, ChevronRight } from "lucide-react";
import { Nft } from "@/types/alchemy/nft-types";
import NftCard from "@/components/nft-card";
import UnclaimedNftCard from "@/components/nft-set-display/unclaimed-nft-card";

interface NftCollectionDisplayProps {
  nfts: Nft[];
}

interface SetInfo {
  setName: string;
  nfts: Nft[];
  setSize: number;
  charityName: string;
}

const NftCollectionDisplay: React.FC<NftCollectionDisplayProps> = ({
  nfts,
}) => {
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
    const displayCount = 6;
    const mysteryCount = Math.min(setInfo.setSize - setInfo.nfts.length, 3);
    const totalDisplayed = Math.min(
      displayCount,
      setInfo.nfts.length + mysteryCount
    );

    return (
      <Card key={setInfo.setName} className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>{setInfo.setName}</CardTitle>
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
                  <LockIcon size={14} /> Incomplete
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {setInfo.nfts.length} of {setInfo.setSize} NFTs Collected
          </p>
          <div className="grid grid-cols-3 gap-2">
            {setInfo.nfts.slice(0, displayCount).map((nft) => (
              <div key={nft.tokenId} className="aspect-square">
                <NftCard nft={nft} compact />
              </div>
            ))}
            {Array.from({ length: mysteryCount }).map((_, index) => (
              <div key={`mystery-${index}`} className="aspect-square">
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
                  <Button variant="outline" size="sm">
                    View All <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>{setInfo.setName} Collection</DialogTitle>
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

export default NftCollectionDisplay;
