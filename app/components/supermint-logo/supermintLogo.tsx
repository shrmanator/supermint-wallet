import React from "react";
import Image from "next/image";
import styles from "./supermintLogo.module.css";

const SuperMintLogo: React.FC = () => {
  return (
    <div className="sm:hidden w-full p-0 flex justify-center items-center mt-12">
      <div className="flex items-center">
        <Image
          src="/images/logo.png"
          alt="SuperMint"
          width={40}
          height={40}
          className={styles.logo}
          priority={true}
        />
        <span className={`${styles.supermintText} ml-2`}>SuperMint</span>
      </div>
    </div>
  );
};

export default SuperMintLogo;
