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
  const { nftsData, nftsError, isLoading, hasPendingNfts } = useNfts(
    account?.address
  );

  console.log("Wallet Page State:", {
    hasChainNfts: nftsData?.ownedNfts?.length > 0,
    hasPendingNfts,
    isLoading,
    error: nftsError ? String(nftsError) : null,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <FlickeringAsciiBanner
          loopCount={Infinity}
          onAnimationComplete={() => {}}
        />
      ) : nftsError ? (
        <PageError message={nftsError.message || "Failed to fetch NFTs"} />
      ) : nftsData?.ownedNfts.length > 0 ? (
        <NftDisplay nfts={nftsData.ownedNfts} />
      ) : hasPendingNfts ? (
        <div>
          <p className="mb-4 text-yellow-600">
            You have pending NFTs that will appear here once minted!
          </p>
          <EmptyState message="Check back soon to see your NFTs." />
        </div>
      ) : (
        <EmptyState message="No NFTs found. Make a donation to get your first NFT!" />
      )}
    </div>
  );
}
