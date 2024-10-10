import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Zap,
  Star,
  User,
  Calendar,
  Heart,
  Layers,
  FileText,
} from "lucide-react";
import { Nft } from "@/types/alchemy/nft-types";

interface MetadataContentProps {
  nft: Nft;
}

const MetadataContent: React.FC<MetadataContentProps> = ({ nft }) => {
  const seriesInfo = nft.raw.metadata.supermint;

  return (
    <Card className="w-full h-full bg-purple-600 text-white border-none">
      <CardContent className="p-2 flex flex-col h-full">
        <h3 className="text-sm font-bold mb-2 text-center text-yellow-300">
          NFT POWER CARD
        </h3>
        <div className="grid grid-cols-2 gap-1 text-xs mb-2">
          <div className="bg-purple-700 p-1">
            <p className="font-semibold flex items-center">
              <Zap className="w-3 h-3 mr-1 text-yellow-300" /> Card ID
            </p>
            <p>{nft.tokenId}</p>
          </div>
          <div className="bg-purple-700 p-1">
            <p className="font-semibold flex items-center">
              <Star className="w-3 h-3 mr-1 text-yellow-300" /> Rarity
            </p>
            <p>
              {seriesInfo.seriesNumber} of {seriesInfo.totalNftsInSeries}
            </p>
          </div>
          <div className="bg-purple-700 p-1">
            <p className="font-semibold flex items-center">
              <Heart className="w-3 h-3 mr-1 text-yellow-300" /> Charity
            </p>
            <p className="truncate">{seriesInfo.charityName}</p>
          </div>
          <div className="bg-purple-700 p-1">
            <p className="font-semibold flex items-center">
              <User className="w-3 h-3 mr-1 text-yellow-300" /> Creator
            </p>
            <p className="truncate">{seriesInfo.seriesArtistName}</p>
          </div>
          <div className="bg-purple-700 p-1">
            <p className="font-semibold flex items-center">
              <Layers className="w-3 h-3 mr-1 text-yellow-300" /> Series
            </p>
            <p className="truncate">{seriesInfo.seriesTitle}</p>
          </div>
          <div className="bg-purple-700 p-1">
            <p className="font-semibold flex items-center">
              <Calendar className="w-3 h-3 mr-1 text-yellow-300" /> Created
            </p>
            <p>{new Date(nft.timeLastUpdated).toLocaleDateString()}</p>
          </div>
        </div>
        <Separator className="bg-purple-400 my-1" />
        <div className="flex-grow overflow-hidden">
          <p className="font-semibold text-xs mb-1 text-yellow-300 flex items-center">
            <FileText className="w-3 h-3 mr-1" /> Message
          </p>
          <ScrollArea className="h-[60px] w-full">
            <p className="text-xs pr-2">
              {seriesInfo.seriesDescription ||
                "No series description available."}
            </p>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetadataContent;
