import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import CustomMediaPlayer from "@/components/media-renderer";
import { Nft } from "@/lib/alchemy/nft-types";

interface NftCardProps {
  nft: Nft;
}

const NftCard: React.FC<NftCardProps> = ({ nft }) => {
  const getMediaSrc = (nft: Nft) => {
    const originalSrc = nft.image.cachedUrl || nft.image.originalUrl || null;
    if (originalSrc) {
      return `/api/image-proxy?url=${encodeURIComponent(originalSrc)}`;
    }
    return null;
  };

  const mediaSrc = getMediaSrc(nft);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        {mediaSrc ? (
          <CustomMediaPlayer
            src={mediaSrc}
            alt={nft.name || `NFT #${nft.tokenId}`}
            contentType={nft.image.contentType}
          />
        ) : (
          <div className="aspect-square flex items-center justify-center bg-muted text-muted-foreground rounded-md">
            No media available
          </div>
        )}
      </CardContent>
      <CardHeader>
        <CardTitle>{nft.name || `NFT #${nft.tokenId}`}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {nft.description || "No description available"}
        </p>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Token ID: {nft.tokenId} | Type: {nft.tokenType}
        </p>
      </CardFooter>
    </Card>
  );
};

export default NftCard;
