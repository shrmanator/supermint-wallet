"use client";

import { useEffect } from "react";
import { useWalletAuth } from "@/hooks/use-wallet-auth";
import { ConnectEmbed } from "thirdweb/react";
import { polygon } from "thirdweb/chains";
import { inAppWallet } from "thirdweb/wallets";
import { client } from "@/lib/thirdweb/client";

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
  } = useWalletAuth();

  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is authenticated. Displaying wallet layout.");
    } else {
      console.log("User is not authenticated. Displaying login.");
    }
  }, [isAuthenticated]);

  // Show the login interface if the user is not authenticated
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-background/100 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <ConnectEmbed
          header={{
            title: "Welcome, login to SuperMint",
            // titleIcon: "images/supermint-logo.png", // Optional icon
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

  // Show the main layout content when the user is authenticated
  return <div>{children}</div>;
}
