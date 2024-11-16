"use client";

import NftDisplay from "@/components/nft-display/nft-display";
import { useNfts } from "@/hooks/use-nfts";
import React from "react";
import { useActiveAccount } from "thirdweb/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import PageError from "@/app/page-error";
import FlickeringAsciiBanner from "@/components/flickering-sm-banner";
import { Gift, ExternalLink } from "lucide-react";
import useSWR from "swr";
import axios from "axios";

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

  if (nftsData?.ownedNfts.length > 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <NftDisplay nfts={nftsData.ownedNfts} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center p-6">
          <Gift className="h-12 w-12 text-muted-foreground mb-4" />
          <CardHeader className="text-center">
            <CardTitle>No NFTs Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6 w-full">
            <p className="text-muted-foreground">
              If you've made a donation, you'll receive an email when your NFT
              is ready.
            </p>

            <div className="space-y-4">
              <h3 className="font-medium text-lg">
                Make a donation to get your first NFT!
              </h3>
              <p className="text-sm text-muted-foreground">
                Choose from our verified charities:
              </p>

              {charitiesData?.charities && (
                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                  <div className="space-y-4">
                    {charitiesData.charities.map(
                      (
                        charity: { name: string; websiteUrl?: string },
                        index: number
                      ) => (
                        <React.Fragment key={charity.name}>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{charity.name}</span>
                            {charity.websiteUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  window.open(charity.websiteUrl, "_blank")
                                }
                                className="ml-2"
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Visit Site
                              </Button>
                            )}
                          </div>
                          {index < charitiesData.charities.length - 1 && (
                            <Separator />
                          )}
                        </React.Fragment>
                      )
                    )}
                  </div>
                </ScrollArea>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
