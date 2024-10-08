"use client";
import React from "react";
import { ConnectButton } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { polygon } from "thirdweb/chains";
import { client } from "@/lib/thirdweb/client";
import { useWalletAuth } from "@/app/hooks/use-wallet-auth";
import SuperMintLogo from "../../components/supermint-logo/SuperMintLogo";

/**
 * WalletLayout Component
 *
 * @description
 * This component serves as a wrapper for pages that require wallet functionality.
 * It provides the necessary context and components for wallet integration,
 * ensuring that child components have access to wallet-related features and data.
 *
 * @example
 *
 * <WalletLayout>
 *   <WalletPage />
 * </WalletLayout>
 *
 *
 * @param {React.ReactNode} children - The child components to be wrapped by the WalletLayout
 * @returns {JSX.Element} A component that provides wallet functionality to its children
 */ const wallets = [
  inAppWallet({
    auth: {
      options: ["google", "email"],
    },
  }),
];

export default function WalletLayout({}: { children: React.ReactNode }) {
  const { handleDoLogin, isLoggedIn, generatePayload, handleDoLogout } =
    useWalletAuth();

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
                size: "wide",
                showThirdwebBranding: false,
              }}
              auth={{
                isLoggedIn: isLoggedIn,
                doLogin: handleDoLogin,
                getLoginPayload: generatePayload,
                doLogout: handleDoLogout,
              }}
            />
          </nav>
        </div>
      </header>
      <footer className="border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} SuperMint Wallet
        </div>
      </footer>
    </div>
  );
}
