"use client";

import { useActiveAccount, MediaRenderer } from "thirdweb/react";
import useSWR from "swr";
import axios from "axios";
import { useEffect } from "react";
import { client } from "@/lib/thirdweb/client";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function WalletPage() {
  const account = useActiveAccount();

  const {
    data: nftsData,
    error: nftsError,
    isLoading: isNftsLoading,
  } = useSWR(
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
      {isNftsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <Skeleton className="w-full h-[200px] rounded-lg" />
                <Skeleton className="h-4 w-[250px] mt-4" />
                <Skeleton className="h-4 w-[200px] mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : nftsError ? (
        <p className="text-xl text-red-500">Error: {nftsError.message || "Failed to fetch NFTs"}</p>
      ) : nftsData?.ownedNfts && nftsData.ownedNfts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nftsData.ownedNfts.map((nft: any) => (
            <Card key={nft.tokenId} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative w-full pt-[100%]">
                  <MediaRenderer
                    client={client}
                    src={nft.image?.cachedUrl || nft.image?.originalUrl || nft.tokenUri}
                    alt={nft.name || `NFT #${nft.tokenId}`}
                    mimeType={nft.image?.contentType}
                    controls={nft.image?.contentType?.startsWith('video')}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </CardContent>
              <CardHeader>
                <CardTitle>{nft.name || `NFT #${nft.tokenId}`}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{nft.description}</p>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-gray-500">
                  Token ID: {nft.tokenId} | Type: {nft.tokenType}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-xl">No NFTs found in this wallet.</p>
      )}
    </div>
  );
}