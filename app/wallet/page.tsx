"use client";

import { useActiveAccount } from "thirdweb/react";
import useSWR from "swr";
import axios from "axios";
import { useEffect } from "react";
import { NftResponse } from "@/lib/alchemy/nft-types";
import NftCard from "@/components/ui/nft-card";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function WalletPage() {
  const account = useActiveAccount();

  const { data: nftsData, error: nftsError } = useSWR<NftResponse>(
    account?.address ? `/api/nfts?owner=${account.address}` : null,
    fetcher
  );

  useEffect(() => {
    if (nftsData) {
      console.log("NFTs Data:", nftsData);
    }
  }, [nftsData]);

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
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nftsData.ownedNfts.map((nft) => (
            <NftCard key={nft.tokenId} nft={nft} />
          ))}
        </div>
      ) : (
        <p className="text-xl">No NFTs found in this wallet.</p>
      )}
    </div>
  );
}
