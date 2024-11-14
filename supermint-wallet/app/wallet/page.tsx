"use client";

import NftDisplay from "@/components/nft-display/nft-display";
import { useNfts } from "@/hooks/use-nfts";
import React from "react";
import { useActiveAccount } from "thirdweb/react";
import EmptyState from "@/app/empty-state";
import PageError from "@/app/page-error";
import FlickeringAsciiBanner from "@/components/flickering-sm-banner";

export default function WalletPage() {
  const account = useActiveAccount();
  const { nftsData, nftsError, isLoading } = useNfts(account?.address);

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <FlickeringAsciiBanner
          loopCount={Infinity}
          onAnimationComplete={() => {}}
        />
      ) : nftsError ? (
        <PageError message={nftsError.message || "Failed to fetch NFTs"} />
      ) : nftsData && nftsData.ownedNfts.length > 0 ? (
        <NftDisplay nfts={nftsData.ownedNfts} />
      ) : (
        <EmptyState message="No NFTs found in this wallet." />
      )}
    </div>
  );
}
