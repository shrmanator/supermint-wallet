"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function Home() {
  const router = useRouter();
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
          <SuperMintLogo
            showText={true}
            textSize="48px"
            showIcon={true}
            iconSize="64px"
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
            if (authenticated) {
              router.push("/wallet");
            }
          }}
        />
      </div>
    );
  }

  // This return statement will rarely be rendered as the useEffect will redirect
  // authenticated users, but it's needed for type safety and edge cases
  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <div>Redirecting to wallet...</div>
      </div>
    </>
  );
}
