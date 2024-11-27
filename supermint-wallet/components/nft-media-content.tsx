import { Badge } from "@/components/ui/badge";
import { ImageIcon } from "lucide-react";
import type { Nft } from "@/alchemy/nft-types";
import { getNftMediaSrc } from "@/alchemy/nft-data-helpers";
import CustomMediaPlayer from "@/components/media-renderer";

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
    const baseClasses = "relative flex items-center justify-center";

    if (layout === "side") {
      return `${baseClasses} ${showMetadata ? "w-1/2 rounded-l-lg" : "w-full"}`;
    }
    if (layout === "bottom") {
      return `${baseClasses} w-full rounded-t-lg`;
    }
    return `${baseClasses} w-full h-full`; // full layout
  };

  return (
    <div className={`${getLayoutClasses()} ${className}`}>
      {showSeriesNumber && supermint?.seriesNumber && (
        <Badge variant="secondary" className="absolute top-2 left-2 z-10">
          #{supermint.seriesNumber}
        </Badge>
      )}

      {mediaSrc ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <CustomMediaPlayer
            src={mediaSrc}
            alt={`${supermint?.seriesTitle || nft.name} ${
              supermint?.seriesNumber ? `#${supermint.seriesNumber}` : ""
            }`.trim()}
            contentType={nft.image?.contentType || "image/png"}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      ) : (
        <div className="w-full h-full min-h-64 flex flex-col items-center justify-center bg-muted">
          <ImageIcon className="w-16 h-16 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No media available</p>
        </div>
      )}
    </div>
  );
}
