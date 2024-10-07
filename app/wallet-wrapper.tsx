"use client";

import React from "react";
import { ConnectButton } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { polygon } from "thirdweb/chains";
import { client } from "@/app/lib/thirdweb/client";
import { useWalletAuth } from "@/app/hooks/use-wallet-auth";
import SuperMintLogo from "@/app/ui/SuperMintLogo";

const wallets = [
  inAppWallet({
    auth: {
      options: ["google", "email"],
    },
  }),
];

export function WalletWrapper({ children }: { children: React.ReactNode }) {
  const { handleDoLogin, isLoggedIn, generatePayload, handleDoLogout } =
    useWalletAuth();

  return (
    <>
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
      <main className="flex-grow">{children}</main>
      <footer className="border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} SuperMint Wallet
        </div>
      </footer>
    </>
  );
}
