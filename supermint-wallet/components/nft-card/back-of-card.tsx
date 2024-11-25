import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Zap,
  Star,
  User,
  Calendar,
  Heart,
  Layers,
  FileText,
  RotateCcw,
} from "lucide-react";
import { Nft } from "@/alchemy/nft-types";

interface BackOfCardProps {
  nft: Nft;
  setIsFlipped: (value: boolean) => void;
}

const BackOfCard: React.FC<BackOfCardProps> = ({ nft, setIsFlipped }) => {
  const { supermint } = nft.raw.metadata;

  const InfoItem = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ElementType;
    label: string;
    value: string | number;
  }) => (
    <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 p-2 rounded-lg">
      <p className="font-medium flex items-center text-blue-200">
        <Icon className="w-3 h-3 mr-1 text-blue-400" />
        {label}
      </p>
      <p className="text-white truncate text-sm">{value}</p>
    </div>
  );

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(false);
  };

  return (
    <div className="h-full flex flex-col">
      <CardContent className="p-4 min-h-0 flex-grow flex flex-col">
        <h3 className="text-sm font-bold mb-3 text-center bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent">
          NFT POWER CARD DETAILS
        </h3>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <InfoItem icon={Zap} label="Token ID" value={nft.tokenId} />
          <InfoItem
            icon={Star}
            label="Rarity"
            value={`${supermint.seriesNumber} of ${supermint.totalNftsInSeries}`}
          />
          <InfoItem
            icon={Heart}
            label="Charity"
            value={supermint.charityName}
          />
          <InfoItem
            icon={User}
            label="Creator"
            value={supermint.seriesArtistName}
          />
          <InfoItem
            icon={Layers}
            label="Series"
            value={supermint.seriesTitle}
          />
          <InfoItem
            icon={Calendar}
            label="Created"
            value={new Date(nft.timeLastUpdated).toLocaleDateString()}
          />
        </div>

        <Separator className="bg-blue-400/30 my-2" />

        <div className="min-h-0 flex-shrink flex flex-col">
          <p className="font-medium text-xs mb-2 text-blue-200 flex items-center">
            <FileText className="w-3 h-3 mr-1" /> Series Description
          </p>
          <ScrollArea className="flex-1 w-full rounded-lg max-h-24">
            <p className="text-xs pr-2 text-blue-100">
              {supermint.seriesDescription ||
                "No series description available."}
            </p>
          </ScrollArea>
        </div>
      </CardContent>

      <CardFooter className="p-2 pt-0 mt-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={handleFlip}
          className="w-full text-xs bg-blue-900/50 hover:bg-blue-800/70 border-blue-400/30 text-blue-200 hover:text-white"
        >
          <RotateCcw className="h-4 w-4 rotate-180 mr-2" />
          <span>Flip</span>
        </Button>
      </CardFooter>
    </div>
  );
};

export default BackOfCard;
