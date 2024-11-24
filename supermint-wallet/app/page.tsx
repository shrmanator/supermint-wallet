"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWalletAuth } from "@/hooks/use-wallet-auth";
import { ConnectEmbed } from "thirdweb/react";
import { polygon } from "thirdweb/chains";
import { inAppWallet } from "thirdweb/wallets";
import { client } from "@/lib/client";
import CelebrateLogo from "@/components/celebrate-logo";

const wallets = [
  inAppWallet({
    auth: {
      options: ["google", "email"],
    },
  }),
];

export default function Home() {
  const router = useRouter();
  const {
    isAuthenticated,
    handleDoLogin,
    generatePayload,
    handleDoLogout,
    checkAuthStatus,
  } = useWalletAuth();

  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is authenticated. Redirecting to wallet...");
      router.push("/wallet");
    } else {
      console.log("User is not authenticated. Displaying login.");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-background/100 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
        <div className="mb-8">
          <CelebrateLogo
            showText={true}
            textSize="48px"
            showIcon={true}
            iconSize="64px"
          />
        </div>
        <ConnectEmbed
          header={{ title: "Choose a login method" }}
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
            if (authenticated) {
              router.push("/wallet");
            }
          }}
        />
      </div>
    );
  }

  return null; // Explicitly return null since redirection is handled in useEffect
}
