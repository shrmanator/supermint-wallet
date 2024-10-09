"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import styles from "./SuperMintLogo.module.css";

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
  iconSize = "45px",
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

  return (
    <div
      className={`${styles.logoContainer} ${
        resolvedTheme === "dark" ? styles.dark : styles.light
      }`}
    >
      {showIcon && logoSrc && (
        <div
          className={`${styles.iconWrapper} ${styles[`iconSize-${iconSize}`]}`}
        >
          <Image
            src={logoSrc}
            alt="SuperMint Logo"
            width={30}
            height={30}
            className={styles.logoImage}
            priority={true}
          />
        </div>
      )}
      {showText && (
        <div className={showIcon ? styles.textWithIcon : ""}>
          <span className={`${styles.supermintText} ${styles[`textSize-${textSize}`]}`}>
            SuperMint
          </span>
        </div>
      )}
    </div>
  );
};
export default SuperMintLogo;
