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
import { Volume2, VolumeX } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CustomMediaPlayerProps {
  src: string;
  alt: string;
  contentType?: string;
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

  useEffect(() => {
    setIsLoading(true);
  }, [src]);

  const handleMediaReady = () => {
    setIsLoading(false);
  };

  const handleMediaError = (
    detail: MediaErrorDetail,
    nativeEvent: MediaErrorEvent
  ) => {
    console.error("Media error:", detail, nativeEvent);
    setIsLoading(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const mediaSrc: VideoSrc | AudioSrc = isVideo
    ? { src, type: contentType as VideoSrc["type"] }
    : { src, type: contentType as AudioSrc["type"] };

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
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          className={`rounded-md object-contain ${className} ${
            isLoading ? "invisible" : "visible"
          }`}
          onLoad={handleMediaReady}
        />
      )}
    </div>
  );
};

export default CustomMediaPlayer;
