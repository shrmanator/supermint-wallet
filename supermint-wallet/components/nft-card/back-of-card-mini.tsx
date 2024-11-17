import React from "react";
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
import { Nft } from "@/alchemy/nft-types";

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
      icon: <Zap className="w-4 h-4 text-yellow-300" />,
    },
    {
      label: "Rarity",
      value: `${seriesInfo.seriesNumber}/${seriesInfo.totalNftsInSeries}`,
      icon: <Star className="w-4 h-4 text-yellow-300" />,
    },
    {
      label: "Charity",
      value: seriesInfo.charityName,
      icon: <Heart className="w-4 h-4 text-red-400" />,
    },
    {
      label: "Creator",
      value: seriesInfo.seriesArtistName,
      icon: <User className="w-4 h-4 text-blue-300" />,
    },
    {
      label: "Series",
      value: seriesInfo.seriesTitle,
      icon: <Layers className="w-4 h-4 text-green-300" />,
    },
    {
      label: "Created",
      value: new Date(nft.timeLastUpdated).toLocaleDateString(),
      icon: <Calendar className="w-4 h-4 text-orange-300" />,
    },
  ];

  const isShortText = (text: string) => text.length <= 10;

  return (
    <Card className="w-full h-full bg-gradient-to-br from-purple-800 to-indigo-900 text-white border-none flex flex-col p-3 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-purple-600 opacity-10 z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
            }}
          />
        ))}
      </div>
      <ScrollArea className="flex-grow z-10 pr-2">
        <h3 className="text-sm font-bold mb-2 text-center text-yellow-300">
          NFT POWER CARD
        </h3>
        <div className="space-y-2">
          {cardDetails.map(({ label, value, icon }) => (
            <div
              key={label}
              className="bg-purple-700 bg-opacity-50 rounded-lg p-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {icon}
                  <span className="font-medium text-xs">{label}</span>
                </div>
                {isShortText(value) && <span className="text-xs">{value}</span>}
              </div>
              {!isShortText(value) && (
                <p className="text-xs mt-1 break-words">{value}</p>
              )}
            </div>
          ))}
          <div className="bg-purple-700 bg-opacity-50 rounded-lg p-2">
            <div className="flex items-center space-x-2 mb-1">
              <FileText className="w-4 h-4 text-yellow-300" />
              <span className="font-medium text-xs">Message</span>
            </div>
            <ScrollArea className="h-20 w-full">
              <div className="pr-4">
                <p className="text-xs whitespace-normal break-words">
                  {seriesInfo.seriesDescription || "No description available."}
                </p>
              </div>
            </ScrollArea>
          </div>
        </div>
      </ScrollArea>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsFlipped(false)}
        className="w-full py-2 mt-3 duration-300 z-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white border-none"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        <span className="text-xs">Flip Card</span>
      </Button>
    </Card>
  );
};

export default BackOfCardMini;
