"use client";

import NftDisplay from "@/components/nft-display/nft-display";
import { useNfts } from "@/hooks/use-nfts";
import React from "react";
import { useActiveAccount } from "thirdweb/react";
import FlickeringAsciiBanner from "@/components/flickering-sm-banner";
import PageError from "@/app/page-error";
import WalletHeader from "./wallet-header";
import EmptyWallet from "./empty-wallet";

export default function WalletPage() {
  const account = useActiveAccount();
  const { nftsData, error, isLoading } = useNfts(account?.address);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FlickeringAsciiBanner loopCount={Infinity} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <PageError message="Failed to fetch NFTs" />
      </div>
    );
  }

  const hasNfts = nftsData?.ownedNfts && nftsData.ownedNfts.length > 0;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <div className="mb-8">
          <WalletHeader />
        </div>
        {hasNfts ? <NftDisplay nfts={nftsData.ownedNfts} /> : <EmptyWallet />}
      </div>
    </div>
  );
}
