"use client";

import NftDisplay from "@/components/nft-display/nft-display";
import { useNfts } from "@/hooks/use-nfts";
import React from "react";
import { useActiveAccount } from "thirdweb/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import PageError from "@/app/page-error";
import FlickeringAsciiBanner from "@/components/flickering-sm-banner";
import { Gift } from "lucide-react";

export default function WalletPage() {
  const account = useActiveAccount();
  const { nftsData, error, isLoading } = useNfts(account?.address);

  if (isLoading) {
    return <FlickeringAsciiBanner loopCount={Infinity} />;
  }

  if (error) {
    return <PageError message="Failed to fetch NFTs" />;
  }

  if (nftsData?.ownedNfts.length > 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <NftDisplay nfts={nftsData.ownedNfts} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="flex flex-col items-center p-6">
        <Gift className="h-12 w-12 text-muted-foreground mb-4" />
        <CardHeader>
          <CardTitle>No NFTs Found</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground space-y-2">
          <p>
            If you've made a donation, you'll receive an email when your NFT is
            ready.
          </p>
          <p>
            Want to start your collection? Choose from our list of verified
            charities and make a donation today!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
