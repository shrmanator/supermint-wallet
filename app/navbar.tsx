"use client";
import React from "react";
import { ConnectButton } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { polygon } from "thirdweb/chains";
import { client } from "@/lib/thirdweb/client";
import { useWalletAuth } from "@/app/hooks/use-wallet-auth";
import SuperMintLogo from "@/components/supermint-logo/SuperMintLogo";

const wallets = [
  inAppWallet({
    auth: {
      options: ["google", "email"],
    },
  }),
];

export default function Navbar() {
  // Removed the children prop
  const { handleDoLogin, isLoggedIn, generatePayload, handleDoLogout } =
    useWalletAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <SuperMintLogo
              showText={true}
              textSize="35px"
              showIcon={true}
              iconSize="45px"
            />
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
  );
}
