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

/**
 * SuperMintLogo Component
 *
 * This component renders the SuperMint logo, adapting to light and dark themes.
 * It uses dynamic imports to load the appropriate logo image based on the current theme.
 *
 * @component
 * @param {Object} props - The component props
 * @param {boolean} [props.showText=true] - Whether to show the "SuperMint" text
 * @param {string} [props.textSize="25px"] - The size of the "SuperMint" text
 * @param {boolean} [props.showIcon=true] - Whether to show the logo icon
 * @param {string} [props.iconSize="45px"] - The size of the logo icon
 *
 * @example
 * <SuperMintLogo showText={true} textSize="30px" showIcon={true} iconSize="50px" />
 *
 * @remarks
 * The component uses dynamic imports to load the logo images to allow for theme-based logo switching without SSR conflicts.
 */
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
          className={styles.iconWrapper}
          style={{ width: iconSize, height: iconSize }}
        >
          <Image
            src={logoSrc}
            alt="SuperMint Logo"
            width={150}
            height={150}
            className={styles.logoImage}
            priority={true}
          />
        </div>
      )}
      {showText && (
        <div className={showIcon ? styles.textWithIcon : ""}>
          <span className={styles.supermintText} style={{ fontSize: textSize }}>
            SuperMint
          </span>
        </div>
      )}
    </div>
  );
};

export default SuperMintLogo;
