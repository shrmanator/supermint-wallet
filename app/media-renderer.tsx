import React, { useState } from "react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import "@vidstack/react/player/styles/base.css";

const NextVidstackMediaRenderer = ({
  src,
  alt,
  contentType,
  className,
}: {
  src: string;
  alt: string;
  contentType?: string;
  className?: string;
}) => {
  const isVideo = contentType?.startsWith("video");
  const [isMuted] = useState(true);

  const handleMediaPlayerReady = () => {
    // Add any logic you want to execute when the media player is ready
  };

  const handleMediaPlayerError = (error: any) => {
    console.error("Media player error:", error);
    // Add any error handling logic here
  };

  return (
    <AspectRatio ratio={16 / 9} className="bg-muted">
      {isVideo ? (
        <MediaPlayer
          src={src}
          playsInline
          loop
          muted={isMuted}
          autoPlay={true}
          onPlay={handleMediaPlayerReady}
          onError={handleMediaPlayerError}
          className="w-full h-full"
        >
          <MediaProvider />
        </MediaPlayer>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          className={`rounded-md object-cover ${className}`}
        />
      )}
    </AspectRatio>
  );
};

export default NextVidstackMediaRenderer;
