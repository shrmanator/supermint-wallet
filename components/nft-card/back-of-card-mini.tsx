import React from "react";
import { Nft } from "@/types/alchemy/nft-types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  FileText,
  Zap,
  Star,
  Heart,
  Calendar,
  User,
  Layers,
} from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

interface BackOfCardProps {
  nft: Nft;
  setIsFlipped: React.Dispatch<React.SetStateAction<boolean>>;
}

const BackOfCardMini: React.FC<BackOfCardProps> = ({ nft, setIsFlipped }) => {
  const seriesInfo = nft.raw.metadata.supermint;

  const cardDetails = [
    {
      label: "ID",
      value: nft.tokenId,
      icon: <Zap className="w-3 h-3 text-yellow-300" />,
    },
    {
      label: "Rarity",
      value: `${seriesInfo.seriesNumber}/${seriesInfo.totalNftsInSeries}`,
      icon: <Star className="w-3 h-3 text-yellow-300" />,
    },
    {
      label: "Charity",
      value: seriesInfo.charityName,
      icon: <Heart className="w-3 h-3 text-red-400" />,
    },
    {
      label: "Creator",
      value: seriesInfo.seriesArtistName,
      icon: <User className="w-3 h-3 text-blue-300" />,
    },
    {
      label: "Series",
      value: seriesInfo.seriesTitle,
      icon: <Layers className="w-3 h-3 text-green-300" />,
    },
    {
      label: "Created",
      value: new Date(nft.timeLastUpdated).toLocaleDateString(),
      icon: <Calendar className="w-3 h-3 text-orange-300" />,
    },
  ];

  return (
    <Card className="w-full h-full bg-gradient-to-br from-purple-700 to-indigo-900 text-white border-none flex flex-col p-2 relative overflow-hidden">
      <h3 className="text-xs font-bold mb-1 text-center text-yellow-300 z-10">
        NFT POWER CARD DETAILS
      </h3>
      <div className="grid grid-cols-1 gap-1 text-[10px] z-10 mb-1">
        {cardDetails.map(({ label, value, icon }) => (
          <div
            key={label}
            className="flex items-center justify-between bg-purple-800 bg-opacity-50 p-1 rounded"
          >
            <div className="flex items-center">
              {icon}
              <span className="font-medium ml-1">{label}:</span>
            </div>
            <span className="truncate max-w-[60%] text-right">{value}</span>
          </div>
        ))}
      </div>
      <div className="z-10 flex-grow flex flex-col">
        <div className="bg-purple-800 bg-opacity-50 p-1 rounded">
          <p className="font-semibold text-[10px] text-yellow-300 flex items-center">
            <FileText className="w-3 h-3 mr-1" /> Description
          </p>
          <ScrollArea className="h-12 w-full">
            <p className="text-[10px] pr-1">
              {seriesInfo.seriesDescription || "No description available."}
            </p>
          </ScrollArea>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsFlipped(false)}
        className="w-full mt-1 text-white hover:text-yellow-300 hover:bg-purple-700 transition-colors duration-300 z-10 p-0 h-6 flex items-center justify-center"
      >
        <ChevronLeft className="w-3 h-3 mr-0.5" />
        <span className="text-[10px]">Flip</span>
      </Button>
    </Card>
  );
};

export default BackOfCardMini;
