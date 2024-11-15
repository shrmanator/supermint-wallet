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
  const { nftsData, nftsError, isLoading, hasPendingNft, hasFailedNft } =
    useNfts(account?.address);

  if (isLoading) {
    return <FlickeringAsciiBanner loopCount={Infinity} />;
  }

  if (nftsError) {
    return <PageError message={nftsError.message || "Failed to fetch NFTs"} />;
  }

  if (nftsData?.ownedNfts.length > 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <NftDisplay nfts={nftsData.ownedNfts} />
      </div>
    );
  }

  if (hasPendingNft) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState message="Your NFT is being minted! Check back soon to see it here." />
      </div>
    );
  }

  if (hasFailedNft) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState message="There was an issue minting your NFT. Please contact support." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <EmptyState message="No NFTs found. Make a donation to get your first NFT!" />
    </div>
  );
}
