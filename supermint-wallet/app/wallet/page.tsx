"use client";

import NftDisplay from "@/components/nft-display/nft-display";
import { useNfts } from "@/hooks/use-nfts";
import React from "react";
import { useActiveAccount } from "thirdweb/react";
import useSWR from "swr";
import axios from "axios";
import FlickeringAsciiBanner from "@/components/flickering-sm-banner";
import PageError from "@/app/page-error";
import WalletHeader from "./wallet-header";
import EmptyWallet from "./empty-wallet";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function WalletPage() {
  const account = useActiveAccount();
  const { nftsData, error, isLoading } = useNfts(account?.address);
  const { data: charitiesData } = useSWR("/api/charities", fetcher);

  if (isLoading) {
    return <FlickeringAsciiBanner loopCount={Infinity} />;
  }

  if (error) {
    return <PageError message="Failed to fetch NFTs" />;
  }

  const hasNfts = nftsData?.ownedNfts && nftsData.ownedNfts.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <WalletHeader />
      {hasNfts ? (
        <NftDisplay nfts={nftsData.ownedNfts} />
      ) : (
        <EmptyWallet charitiesData={charitiesData} />
      )}
    </div>
  );
}
