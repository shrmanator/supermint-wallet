"use client";

import { useEffect, useState } from "react";
import { useWalletAuth } from "@/hooks/use-wallet-auth";
import { ConnectEmbed } from "thirdweb/react";
import { polygon } from "thirdweb/chains";
import { inAppWallet } from "thirdweb/wallets";
import { client } from "@/lib/thirdweb/client";
import { WelcomeModal } from "@/components/new-user-welcome-modal";
import SuperMintLogo from "@/components/supermint-logo";

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
    isAuthenticated,
    handleDoLogin,
    generatePayload,
    handleDoLogout,
    checkAuthStatus,
    account,
    isNewUser,
  } = useWalletAuth();

  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (isNewUser) setShowWelcome(true);
  }, [isNewUser]);

  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is authenticated. Displaying wallet layout.");
    } else {
      console.log("User is not authenticated. Displaying login.");
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-background/100 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
        <div className="mb-8">
          <SuperMintLogo
            showText={true}
            textSize="48px" // Using a larger text size
            showIcon={true}
            iconSize="64px" // Making the icon slightly larger than the text
          />
        </div>
        <ConnectEmbed
          header={{
            title: "",
          }}
          showThirdwebBranding={false}
          chain={polygon}
          client={client}
          wallets={wallets}
          auth={{
            isLoggedIn: async () => checkAuthStatus(),
            doLogin: handleDoLogin,
            getLoginPayload: generatePayload,
            doLogout: handleDoLogout,
          }}
          onConnect={async () => {
            console.log("Login complete. Checking authentication...");
            const authenticated = await checkAuthStatus();
            console.log(
              "Authentication status in welcome (onConnect):",
              authenticated
            );
          }}
        />
      </div>
    );
  }

  return (
    <>
      <div>{children}</div>
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
