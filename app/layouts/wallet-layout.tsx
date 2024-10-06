// app/layouts/WalletLayout.tsx
"use client";
import React from "react";
import { ConnectButton } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { polygon } from "thirdweb/chains";
import { client } from "@/app/lib/thirdweb/client";
import SuperMintLogo from "@/app/ui/supermint-logo/supermintLogo";
import { useWalletAuth } from "@/app/hooks/use-wallet-auth";

// Wraps pages that require wallet functionality.
const wallets = [
  inAppWallet({
    auth: {
      options: ["google", "email"],
    },
  }),
];

export default function WalletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    userEmail,
    nftClaimResult,
    claimError,
    account,
    handleDoLogin,
    handleIsLoggedIn,
    handleGetLoginPayload,
    handleDoLogout,
  } = useWalletAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
            <div className="flex items-center h-full">
              <SuperMintLogo />
            </div>
            <ConnectButton
              chain={polygon}
              client={client}
              wallets={wallets}
              connectButton={{ label: "Login" }}
              connectModal={{
                title: "",
                size: "compact",
                showThirdwebBranding: false,
              }}
              auth={{
                isLoggedIn: handleIsLoggedIn,
                doLogin: handleDoLogin,
                getLoginPayload: handleGetLoginPayload,
                doLogout: handleDoLogout,
              }}
            />
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        {userEmail && <p>Logged in with: {userEmail}</p>}
        {account && <p>Wallet address: {account.address}</p>}
        {nftClaimResult && (
          <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded">
            <h3 className="font-bold">NFT Claim Result:</h3>
            <pre>{JSON.stringify(nftClaimResult, null, 2)}</pre>
          </div>
        )}
        {claimError && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded text-red-700">
            Error: {claimError}
          </div>
        )}
        {children}
      </main>
      <footer className="border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} SuperMint Wallet
        </div>
      </footer>
    </div>
  );
}
