"use client";

import React from "react";
import Image from "next/image";

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
  // Convert pixel sizes to numbers for Tailwind classes
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

  return (
    <div className="flex items-center">
      {showIcon && (
        <div className="relative" style={{ width: iconSize, height: iconSize }}>
          <Image
            src="/images/supermint-logo.png"
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
            className={`font-bold ${textSizeClass} text-white`}
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
