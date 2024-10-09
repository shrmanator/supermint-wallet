import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import CustomMediaPlayer from "@/components/media-renderer";
import { Nft } from "@/types/alchemy/nft-types";

interface NftCardProps {
  nft: Nft;
  layout?: "side" | "bottom";
  showMetadata?: boolean;
}

const NftCard: React.FC<NftCardProps> = ({
  nft,
  layout = "bottom",
  showMetadata = true,
}) => {
  const getMediaSrc = (nft: Nft) => {
    return nft.image.cachedUrl || nft.image.originalUrl || null;
  };

  const mediaSrc = getMediaSrc(nft);
  const seriesInfo = nft.raw.metadata.supermint;

  const MediaContent = () => (
    <div
      className={`relative ${
        showMetadata && layout === "side" ? "w-1/2" : "w-full"
      } ${
        layout === "bottom" ? "rounded-t-lg" : "rounded-l-lg"
      } overflow-hidden`}
    >
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
  );

  const InfoContent = () => (
    <div
      className={`${
        layout === "side" ? "w-1/2 border-l" : "w-full border-t"
      } border-gray-700`}
    >
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
            {seriesInfo.seriesArtistName}
          </p>
          <p className="text-xs text-gray-400 truncate flex-1 text-right">
            {seriesInfo.charityName}
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
    </div>
  );

  return (
    <Card
      className={`overflow-hidden bg-black text-white rounded-none ${
        showMetadata && layout === "side" ? "flex" : ""
      }`}
    >
      <MediaContent />
      {showMetadata && <InfoContent />}
    </Card>
  );
};

export default NftCard;
