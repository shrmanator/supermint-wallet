import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, RotateCcw, Send } from "lucide-react";
import CustomMediaPlayer from "@/components/media-renderer";
import BackOfCard from "./back-of-card";
import { Nft } from "@/alchemy/nft-types";
import { getNftMediaSrc } from "@/alchemy/nft-data-helpers";
import { NftModal } from "@/app/wallet/nft-modal";
import { TransferModal } from "../nft-transfer-modal";

interface NftCardProps {
  nft: Nft;
  layout?: "side" | "bottom";
  showMetadata?: boolean;
  duplicateCount?: number;
}

const NftCard: React.FC<NftCardProps> = ({
  nft,
  layout = "bottom",
  showMetadata = true,
  duplicateCount = 1,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isNftModalOpen, setIsNftModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  if (!nft?.raw?.metadata?.supermint) return null;

  const mediaSrc = getNftMediaSrc(nft);
  const { supermint } = nft.raw.metadata;

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const MediaContent = () => (
    <div
      onClick={() => setIsNftModalOpen(true)}
      className={`relative cursor-pointer ${
        showMetadata && layout === "side" ? "w-1/2" : "w-full"
      } ${
        layout === "bottom" ? "rounded-t-lg" : "rounded-l-lg"
      } overflow-hidden`}
    >
      {duplicateCount > 1 && (
        <div className="absolute top-2 left-2 bg-black/75 text-white px-2 py-1 rounded-md text-sm z-10">
          x{duplicateCount}
        </div>
      )}
      {mediaSrc ? (
        <CustomMediaPlayer
          src={mediaSrc}
          alt={`${supermint.seriesTitle} #${supermint.seriesNumber}`}
          contentType={nft.image?.contentType || "image/png"}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-64 flex flex-col items-center justify-center bg-muted">
          <ImageIcon className="w-16 h-16 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No media available</p>
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
            {supermint.seriesTitle}
          </h3>
          <span className="text-xs text-muted-foreground ml-2">
            {supermint.seriesNumber} of {supermint.totalNftsInSeries}
          </span>
        </div>
        <div className="flex justify-between mt-1">
          <p className="text-xs text-muted-foreground truncate flex-1">
            {supermint.seriesArtistName}
          </p>
          <p className="text-xs text-muted-foreground truncate flex-1 text-right">
            {supermint.charityName}
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-2 pt-0 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs gap-2"
          onClick={handleDetailsClick}
        >
          <RotateCcw className="h-4 w-4 transform scale-x-[-1]" />
          Flip
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs gap-2"
          onClick={() => setIsTransferModalOpen(true)}
        >
          <Send className="h-4 w-4" />
          Send
        </Button>
      </CardFooter>
    </div>
  );

  return (
    <>
      <div
        className={`${isFlipped ? "z-50" : "z-0"} relative`}
        style={{
          perspective: 1000,
          transition: "z-index 0ms linear 300ms",
        }}
      >
        <motion.div
          className="relative"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <Card
              className={`overflow-hidden ${
                showMetadata && layout === "side" ? "flex" : ""
              }`}
            >
              <MediaContent />
              {showMetadata && <InfoContent />}
            </Card>
          </div>

          <div
            className="absolute inset-0"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <Card className="overflow-hidden h-full">
              <BackOfCard nft={nft} setIsFlipped={setIsFlipped} />
            </Card>
          </div>
        </motion.div>
      </div>

      <NftModal
        isOpen={isNftModalOpen}
        onClose={() => setIsNftModalOpen(false)}
        nft={nft}
      />

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        nft={nft}
      />
    </>
  );
};

export default NftCard;
