import React, { useState } from "react";
import { Card, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InfoIcon, ExternalLink, ChevronUp } from "lucide-react";
import CustomMediaPlayer from "@/components/media-renderer";
import { Nft } from "@/types/alchemy/nft-types";

interface NftCardProps {
  nft: Nft;
}

const NftCard: React.FC<NftCardProps> = ({ nft }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getMediaSrc = (nft: Nft) => {
    const originalSrc = nft.image.cachedUrl || nft.image.originalUrl || null;
    if (originalSrc) {
      return `/api/image-proxy?url=${encodeURIComponent(originalSrc)}`;
    }
    return null;
  };

  const mediaSrc = getMediaSrc(nft);

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 relative group">
      <div className="aspect-square">
        {mediaSrc ? (
          <CustomMediaPlayer
            src={mediaSrc}
            alt={nft.name || `NFT #${nft.tokenId}`}
            contentType={nft.image.contentType}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
            <InfoIcon className="w-12 h-12 opacity-50" />
          </div>
        )}
      </div>

      <div
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 transform transition-all duration-300 ease-in-out ${
          isExpanded ? "h-auto" : "h-20"
        }`}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-white truncate">
            {nft.name || `NFT #${nft.tokenId}`}
          </h3>
          <Badge variant="secondary" className="bg-white/20 text-white">
            {nft.tokenType}
          </Badge>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ${
            isExpanded ? "max-h-40" : "max-h-0"
          }`}
        >
          <ScrollArea className="h-32 pr-4">
            <p className="text-sm text-white/80">
              {nft.description || "No description available"}
            </p>
          </ScrollArea>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white hover:bg-white/20"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <ChevronUp
            className={`w-6 h-6 transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </Button>
      </div>

      <CardFooter className="p-2 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="mr-2 bg-white/20 hover:bg-white/40"
            >
              <InfoIcon className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{nft.name || `NFT #${nft.tokenId}`}</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <p>
                <strong>Token ID:</strong> {nft.tokenId}
              </p>
              <p>
                <strong>Token Type:</strong> {nft.tokenType}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {nft.description || "No description available"}
              </p>
            </div>
          </DialogContent>
        </Dialog>

        <Button
          variant="secondary"
          size="icon"
          className="bg-white/20 hover:bg-white/40"
          onClick={() => window.open("https://marketplace-url.com", "_blank")}
        >
          <ExternalLink className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NftCard;
