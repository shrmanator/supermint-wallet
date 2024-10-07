import React, { useState } from "react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  MediaErrorDetail,
  MediaErrorEvent,
  MediaPlayer,
  MediaProvider,
} from "@vidstack/react";
import "@vidstack/react/player/styles/base.css";
import { Volume2, VolumeX } from "lucide-react";

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
  const [isMuted, setIsMuted] = useState(true);

  const handleMediaPlayerReady = () => {
    // Add any logic you want to execute when the media player is ready
  };

  const handleMediaPlayerError = (
    detail: MediaErrorDetail,
    nativeEvent: MediaErrorEvent
  ) => {
    console.error("Media player error:", detail, nativeEvent);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <AspectRatio ratio={16 / 9} className="bg-muted relative">
      {isVideo ? (
        <>
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
          <button
            onClick={toggleMute}
            className="absolute top-2 right-2 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-opacity"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </>
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
