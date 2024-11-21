"use client";

import NftDisplay from "@/components/nft-display/nft-display";
import { useNfts } from "@/hooks/use-nfts";
import React from "react";
import { useActiveAccount } from "thirdweb/react";
import FlickeringAsciiBanner from "@/components/flickering-sm-banner";
import PageError from "@/app/page-error";
import WalletHeader from "./wallet-header";
import EmptyWallet from "./empty-wallet";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function WalletPage() {
  const account = useActiveAccount();
  const { nftsData, error, isLoading } = useNfts(account?.address);

  if (isLoading) {
    return <FlickeringAsciiBanner loopCount={Infinity} />;
  }

  if (error) {
    return <PageError message="Failed to fetch NFTs" />;
  }

  const hasNfts = nftsData?.ownedNfts && nftsData.ownedNfts.length > 0;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Your Wallet</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>NFT Collection</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="container mx-auto px-4 py-8">
            <WalletHeader />
            {hasNfts ? (
              <NftDisplay nfts={nftsData.ownedNfts} />
            ) : (
              <EmptyWallet />
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
