import React from "react";
import Image from "next/image";
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
  return (
    <div className={styles.logoContainer}>
      {showIcon && (
        <div
          className={styles.iconWrapper}
          style={{ width: iconSize, height: iconSize }}
        >
          <Image
            src="/images/supermint-logo.png"
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
