"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

interface SuperMintLogoProps {
  showText?: boolean;
  textSize?: string;
  showIcon?: boolean;
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

  const getWalletPosition = (size: string) => {
    const pixels = parseInt(size);
    // Calculate wallet text size and positioning based on main text size
    const walletSize = Math.max(10, Math.floor(pixels * 0.35)); // Min 10px, or 35% of main text
    const topOffset = Math.floor(pixels * -0.05); // Negative value moves up
    const leftOffset = Math.floor(pixels * 0.7); // Proportional to text size

    return {
      fontSize: `${walletSize}px`,
      top: `${topOffset}px`,
      left: `${leftOffset}px`,
    };
  };

  const textSizeClass = getTextSizeClass(textSize);
  const textColor = resolvedTheme === "dark" ? "text-white" : "text-black";
  const walletStyle = getWalletPosition(textSize);

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
          <div className="relative">
            <span
              className={`font-bold ${textSizeClass} ${textColor} leading-none`}
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              Super<span className="relative">Mint</span>
            </span>
            <span
              className="absolute text-sky-400/90 tracking-wide"
              style={{
                fontFamily: "'Inter', sans-serif",
                ...walletStyle,
              }}
            >
              wallet
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperMintLogo;
