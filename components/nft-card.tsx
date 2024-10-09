import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import CustomMediaPlayer from "@/components/media-renderer";
import { Nft } from "@/types/alchemy/nft-types";

interface NftCardProps {
  nft: Nft;
}

const NftCard: React.FC<NftCardProps> = ({ nft }) => {
  const getMediaSrc = (nft: Nft) => {
    return nft.image.cachedUrl || nft.image.originalUrl || null;
  };

  const mediaSrc = getMediaSrc(nft);
  const seriesInfo = nft.raw.metadata.supermint;

  return (
    <Card className="overflow-hidden bg-black text-white">
      <div className="aspect-square relative">
        {mediaSrc ? (
          <CustomMediaPlayer
            src={mediaSrc}
            alt={seriesInfo.seriesTitle || `NFT #${nft.tokenId}`}
            contentType={nft.image.contentType}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <ImageIcon className="w-16 h-16 text-gray-600 mb-2" />
            <p className="text-sm text-gray-400">No image available</p>
          </div>
        )}
      </div>

      <CardContent className="p-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium truncate flex-1">
            {seriesInfo.seriesTitle}
          </h3>
          <span className="text-xs text-gray-400 ml-2">
            #{seriesInfo.seriesNumber} of {seriesInfo.totalNftsInSeries}
          </span>
        </div>
        <div className="flex justify-between mt-1">
          <p className="text-xs text-gray-400 truncate flex-1">
            Artist: {seriesInfo.seriesArtistName}
          </p>
          <p className="text-xs text-gray-400 truncate flex-1 text-right">
            From: {seriesInfo.charityName}
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-2 pt-0">
        <Button
          variant="secondary"
          size="sm"
          className="w-full text-xs"
          onClick={() => {
            /* Handle transfer logic */
          }}
        >
          Transfer
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NftCard;
