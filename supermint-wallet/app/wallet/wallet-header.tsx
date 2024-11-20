"use client";

import { Wallet } from "lucide-react";

export default function WalletHeader(props: { hasNfts: boolean }) {
  if (props.hasNfts) {
    return (
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Wallet className="h-12 w-12 text-primary mr-4" />
          <h1 className="text-3xl font-bold tracking-tight">
            Your NFT Collection
          </h1>
        </div>
      </div>
    );
  }
}
