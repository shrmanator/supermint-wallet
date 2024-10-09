"use client";

import React from "react";
import { useActiveAccount } from "thirdweb/react";
import useSWR from "swr";
import axios from "axios";
import { NftResponse } from "@/types/alchemy/nft-types";
import NftDisplay from "@/components/nft-display/nft-display";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function WalletPage() {
  const account = useActiveAccount();

  const { data: nftsData, error: nftsError } = useSWR<NftResponse>(
    account?.address ? `/api/nfts?owner=${account.address}` : null,
    fetcher
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your NFT Collection</h1>
      {nftsError ? (
        <p className="text-xl text-red-500">
          Error: {nftsError.message || "Failed to fetch NFTs"}
        </p>
      ) : !nftsData ? (
        <p className="text-xl">Loading your NFTs...</p>
      ) : nftsData.ownedNfts && nftsData.ownedNfts.length > 0 ? (
        <NftDisplay nfts={nftsData.ownedNfts} />
      ) : (
        <p className="text-xl">No NFTs found in this wallet.</p>
      )}
    </div>
  );
}
