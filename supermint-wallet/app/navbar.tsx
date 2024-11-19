"use client";
import React, { useState, useEffect } from "react";
import { ConnectButton } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { polygon } from "thirdweb/chains";
import { client } from "@/lib/thirdweb/client";
import SuperMintLogo from "@/components/supermint-logo/SuperMintLogo";
import { useWalletAuth } from "@/hooks/use-wallet-auth";
import { WelcomeModal } from "@/components/new-user-welcome-modal";

const wallets = [
  inAppWallet({
    auth: {
      options: ["google", "email"],
    },
  }),
];

export default function NavBar() {
  const {
    handleDoLogin,
    isLoggedIn,
    generatePayload,
    handleDoLogout,
    account,
    isNewUser,
  } = useWalletAuth();

  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (isNewUser) setShowWelcome(true);
  }, [isNewUser]);

  return (
    <>
      <header className="border-b">
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
            <div className="flex items-center gap-4">
              <ConnectButton
                chain={polygon}
                client={client}
                wallets={wallets}
                onDisconnect={account ? handleDoLogout : undefined}
                connectButton={{
                  label: account ? "Disconnect" : "Login",
                }}
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
            </div>
          </nav>
        </div>
      </header>
      {account && (
        <WelcomeModal
          isOpen={showWelcome}
          walletAddress={account.address}
          onClose={() => setShowWelcome(false)}
        />
      )}
    </>
  );
}
