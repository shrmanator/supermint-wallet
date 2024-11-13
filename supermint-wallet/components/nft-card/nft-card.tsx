import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageIcon } from "lucide-react";
import CustomMediaPlayer from "@/components/media-renderer";
import BackOfCard from "./back-of-card";
import { Nft } from "@/alchemy/nft-types";

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
  const [isFlipped, setIsFlipped] = useState(false);

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
      <Badge variant="secondary" className="absolute top-2 left-2 z-10">
        #{seriesInfo.seriesNumber}
      </Badge>
      {mediaSrc ? (
        <CustomMediaPlayer
          src={mediaSrc}
          alt={seriesInfo.seriesTitle || `NFT #${nft.tokenId}`}
          contentType={nft.image.contentType}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-muted">
          <ImageIcon className="w-16 h-16 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No image available</p>
        </div>
      )}
    </div>
  );

  const InfoContent = () => (
    <div
      className={`${
        layout === "side" ? "w-1/2 border-l" : "w-full border-t"
      } border-border`}
    >
      <CardContent className="p-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium truncate flex-1">
            {seriesInfo.seriesTitle}
          </h3>
          <span className="text-xs text-muted-foreground ml-2">
            {seriesInfo.seriesNumber} of {seriesInfo.totalNftsInSeries}
          </span>
        </div>
        <div className="flex justify-between mt-1">
          <p className="text-xs text-muted-foreground truncate flex-1">
            {seriesInfo.seriesArtistName}
          </p>
          <p className="text-xs text-muted-foreground truncate flex-1 text-right">
            {seriesInfo.charityName}
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-2 pt-0 flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1 text-xs"
          onClick={() => {
            /* Handle transfer logic */
          }}
        >
          Transfer
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          Details
        </Button>
      </CardFooter>
    </div>
  );

  return (
    <motion.div
      className="relative"
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <Card
          className={`overflow-hidden ${
            showMetadata && layout === "side" ? "flex" : ""
          } [backface-visibility:hidden]`}
        >
          <MediaContent />
          {showMetadata && <InfoContent />}
        </Card>
        <Card className="absolute inset-0 overflow-hidden [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <BackOfCard nft={nft} setIsFlipped={setIsFlipped} />
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default NftCard;
