"use client";
import React, { useState, useEffect } from "react";
import { ConnectButton, darkTheme } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { polygon } from "thirdweb/chains";
import { client } from "@/lib/client";
import { useWalletAuth } from "@/hooks/use-wallet-auth";
import { WelcomeModal } from "@/components/new-user-welcome-modal";
import CelebrateLogo from "@/components/celebrate-logo";

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
              <CelebrateLogo
                showText={true}
                textSize="10px"
                showIcon={true}
                iconSize="50px"
              />
            </div>
            <ConnectButton
              theme={darkTheme({
                colors: {
                  modalBg: "hsl(0, 0%, 4%)",
                  borderColor: "hsl(0, 0%, 98%)",
                  separatorLine: "hsl(0, 0%, 0%)",
                  accentText: "hsl(216, 100%, 50%)",
                },
              })}
              chain={polygon}
              client={client}
              wallets={wallets}
              onDisconnect={account ? handleDoLogout : undefined}
              connectButton={{
                label: account ? "Disconnect" : "Login",
              }}
              connectModal={{
                title: "Choose a login method",
                size: "compact",
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
