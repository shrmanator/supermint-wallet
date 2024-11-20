"use client";

import { Wallet } from "lucide-react";

export default function WalletHeader() {
  return (
    <div className="mb-6">
      <div className="flex items-center">
        <Wallet className="h-8 w-8 text-primary mr-4" />
        <h1 className="text-2xl font-medium">Your Wallet</h1>
      </div>
    </div>
  );
}
