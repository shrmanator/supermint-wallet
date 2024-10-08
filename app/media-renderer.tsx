import React, { useState, useEffect } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";

interface CustomMediaPlayerProps {
  src: string;
  alt: string;
  contentType?: string;
  className?: string;
  priority?: boolean;
}

const CustomMediaPlayer: React.FC<CustomMediaPlayerProps> = ({
  src,
  alt,
  contentType,
  className,
  priority = false,
}) => {
  const isVideo = contentType?.startsWith("video");
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reset loading state when src changes
    setIsLoading(true);
  }, [src]);

  const handleMediaPlayerReady = () => {
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleMediaPlayerError = (
    detail: MediaErrorDetail,
    nativeEvent: MediaErrorEvent
  ) => {
    console.error("Media player error:", detail, nativeEvent);
    setIsLoading(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <AspectRatio ratio={16 / 9} className="bg-muted relative">
      {isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-md" />
      )}
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
            className={`w-full h-full ${isLoading ? "invisible" : "visible"}`}
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
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
          className={`rounded-md object-cover ${className} ${
            isLoading ? "invisible" : "visible"
          }`}
          onLoadingComplete={handleImageLoad}
        />
      )}
    </AspectRatio>
  );
};

export default CustomMediaPlayer;
