"use client";

import { useActiveAccount } from "thirdweb/react";
import useSWR from "swr";
import axios from "axios";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Nft, NftResponse } from "@/lib/alchemy/nft-types";
import CustomMediaPlayer from "@/app/media-renderer";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function WalletPage() {
  const account = useActiveAccount();

  const {
    data: nftsData,
    error: nftsError,
    isLoading: isNftsLoading,
  } = useSWR<NftResponse>(
    account?.address ? `/api/nfts?owner=${account.address}` : null,
    fetcher
  );

  useEffect(() => {
    if (nftsData) {
      console.log("NFTs Data:", nftsData);
    }
  }, [nftsData]);

  const getMediaSrc = (nft: Nft) => {
    const originalSrc = nft.image.cachedUrl || nft.image.originalUrl || null;
    if (originalSrc) {
      return `/api/image-proxy?url=${encodeURIComponent(originalSrc)}`;
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your NFT Collection</h1>
      {isNftsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <Skeleton className="w-full aspect-square rounded-md" />
                <Skeleton className="h-4 w-[250px] mt-4" />
                <Skeleton className="h-4 w-[200px] mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : nftsError ? (
        <p className="text-xl text-red-500">
          Error: {nftsError.message || "Failed to fetch NFTs"}
        </p>
      ) : nftsData?.ownedNfts && nftsData.ownedNfts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nftsData.ownedNfts.map((nft: Nft) => {
            const mediaSrc = getMediaSrc(nft);

            return (
              <Card key={nft.tokenId} className="overflow-hidden">
                <CardContent className="p-4">
                  {mediaSrc ? (
                    <CustomMediaPlayer
                      src={mediaSrc}
                      alt={nft.name || `NFT #${nft.tokenId}`}
                      contentType={nft.image.contentType}
                    />
                  ) : (
                    <div className="aspect-square flex items-center justify-center bg-muted text-muted-foreground rounded-md">
                      No media available
                    </div>
                  )}
                </CardContent>
                <CardHeader>
                  <CardTitle>{nft.name || `NFT #${nft.tokenId}`}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {nft.description || "No description available"}
                  </p>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-muted-foreground">
                    Token ID: {nft.tokenId} | Type: {nft.tokenType}
                  </p>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <p className="text-xl">No NFTs found in this wallet.</p>
      )}
    </div>
  );
}
