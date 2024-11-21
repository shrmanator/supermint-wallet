"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

interface SuperMintLogoProps {
  /**
   * Controls whether to show the "SuperMint" text.
   * @default true
   */
  showText?: boolean;
  /**
   * Allows you to set a custom font size for the text.
   * @default '25px'
   */
  textSize?: string;
  /**
   * Controls whether to show the logo icon.
   * @default true
   */
  showIcon?: boolean;
  /**
   * Allows you to set a custom size for the logo icon.
   * @default '35px'
   */
  iconSize?: string;
}

const SuperMintLogo: React.FC<SuperMintLogoProps> = ({
  showText = true,
  textSize = "25px",
  showIcon = true,
  iconSize = "35px",
}) => {
  const { resolvedTheme } = useTheme();
  const [logoSrc, setLogoSrc] = useState<string | null>(null);

  useEffect(() => {
    const loadLogo = async () => {
      const { WhiteSuperMintLogo, BlackSuperMintLogo } = await import(
        "@/public/base64/supermint-logos"
      );
      setLogoSrc(
        resolvedTheme === "dark" ? WhiteSuperMintLogo : BlackSuperMintLogo
      );
    };
    loadLogo();
  }, [resolvedTheme]);

  const getTextSizeClass = (size: string) => {
    const pixels = parseInt(size);
    if (pixels <= 16) return "text-base";
    if (pixels <= 18) return "text-lg";
    if (pixels <= 20) return "text-xl";
    if (pixels <= 24) return "text-2xl";
    if (pixels <= 30) return "text-3xl";
    if (pixels <= 36) return "text-4xl";
    if (pixels <= 48) return "text-5xl";
    return "text-6xl";
  };

  const textSizeClass = getTextSizeClass(textSize);
  const textColor = resolvedTheme === "dark" ? "text-white" : "text-black";

  return (
    <div className="flex items-center">
      {showIcon && logoSrc && (
        <div className="relative" style={{ width: iconSize, height: iconSize }}>
          <Image
            src={logoSrc}
            alt="SuperMint Logo"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain"
            priority={true}
          />
        </div>
      )}
      {showText && (
        <div className={`${showIcon ? "ml-2" : ""}`}>
          <span
            className={`font-bold ${textSizeClass} ${textColor}`}
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            SuperMint
          </span>
        </div>
      )}
    </div>
  );
};

export default SuperMintLogo;
