// components/nft-media-content.tsx
import { Badge } from "@/components/ui/badge";
import { ImageIcon } from "lucide-react";
import type { Nft } from "@/alchemy/nft-types";
import CustomMediaPlayer from "./media-renderer";
import { getNftMediaSrc } from "@/alchemy/nft-data-helpers";

interface NFTMediaContentProps {
  nft: Nft;
  showSeriesNumber?: boolean;
  layout?: "side" | "bottom" | "full";
  showMetadata?: boolean;
  className?: string;
}

export function NFTMediaContent({
  nft,
  showSeriesNumber = true,
  layout = "full",
  showMetadata = false,
  className = "",
}: NFTMediaContentProps) {
  const supermint = nft.raw?.metadata?.supermint;
  const mediaSrc = getNftMediaSrc(nft);

  const getLayoutClasses = () => {
    if (layout === "side") {
      return showMetadata ? "w-1/2 rounded-l-lg" : "w-full";
    }
    if (layout === "bottom") {
      return "w-full rounded-t-lg";
    }
    return "w-full"; // full layout
  };

  return (
    <div
      className={`relative ${getLayoutClasses()} overflow-hidden ${className}`}
    >
      {showSeriesNumber && supermint?.seriesNumber && (
        <Badge variant="secondary" className="absolute top-2 left-2 z-10">
          #{supermint.seriesNumber}
        </Badge>
      )}

      {mediaSrc ? (
        <CustomMediaPlayer
          src={mediaSrc}
          alt={`${supermint?.seriesTitle || nft.name} ${
            supermint?.seriesNumber ? `#${supermint.seriesNumber}` : ""
          }`.trim()}
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
}
