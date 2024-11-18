import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  MediaErrorDetail,
  MediaErrorEvent,
  MediaPlayer,
  MediaProvider,
  VideoSrc,
  AudioSrc,
} from "@vidstack/react";
import "@vidstack/react/player/styles/base.css";
import { Volume2, VolumeX, ImageOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CustomMediaPlayerProps {
  src: string;
  alt: string;
  contentType?: string | null;
  className?: string;
}

const CustomMediaPlayer: React.FC<CustomMediaPlayerProps> = ({
  src,
  alt,
  contentType,
  className,
}) => {
  const isVideo = contentType?.startsWith("video");
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setImageError(false);
    console.log("src:", src);
  }, [src]);

  const handleMediaReady = () => {
    setIsLoading(false);
  };

  const handleMediaError = (
    detail?: MediaErrorDetail,
    nativeEvent?: MediaErrorEvent
  ) => {
    console.error("Media error:", detail, nativeEvent);
    setIsLoading(false);
    setImageError(true);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Proxy through the correct endpoint
  const getProxiedUrl = (url: string) => {
    console.log("getProxiedUrl:", url);
    if (!url) return "/api/placeholder/400/400";
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  };

  const mediaSrc: VideoSrc | AudioSrc = isVideo
    ? { src: getProxiedUrl(src), type: contentType as VideoSrc["type"] }
    : { src: getProxiedUrl(src), type: contentType as AudioSrc["type"] };
  console.log("mediaSrc:", mediaSrc);
  if (imageError) {
    return (
      <div className="relative w-full pt-[100%]">
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted rounded-md">
          <ImageOff className="w-12 h-12 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Media unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full pt-[100%]">
      {isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-md" />
      )}
      {isVideo ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <MediaPlayer
            src={mediaSrc}
            playsInline
            loop
            muted={isMuted}
            autoPlay={true}
            onCanPlay={handleMediaReady}
            onError={handleMediaError}
            className={`max-w-full max-h-full ${
              isLoading ? "invisible" : "visible"
            }`}
          >
            <MediaProvider />
          </MediaPlayer>
          <button
            onClick={toggleMute}
            className="absolute top-2 right-2 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-opacity"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      ) : (
        <Image
          src={getProxiedUrl(src)}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          className={`rounded-md object-contain ${className} ${
            isLoading ? "invisible" : "visible"
          }`}
          onLoad={handleMediaReady}
          onError={() => handleMediaError()}
          unoptimized
        />
      )}
    </div>
  );
};

export default CustomMediaPlayer;
