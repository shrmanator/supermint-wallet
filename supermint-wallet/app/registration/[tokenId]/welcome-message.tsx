"use client";

import { FC, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ConnectButton } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { polygon } from "thirdweb/chains";
import { client } from "@/lib/thirdweb/client";
import { useRouter } from "next/navigation";
import { useWalletAuth } from "@/hooks/use-wallet-auth";
import { WelcomeModal } from "@/components/new-user-welcome-modal";
import SuperMintLogo from "@/components/supermint-logo";

const wallets = [
  inAppWallet({
    auth: {
      options: ["google", "email"],
    },
  }),
];

interface WelcomeMessageProps {
  charityDetails?: { charityName: string; donorEmail: string } | null;
  isVisible: boolean;
}

const WelcomeMessage: FC<WelcomeMessageProps> = ({
  charityDetails,
  isVisible,
}) => {
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
      console.log("User is authenticated. Redirecting to /wallet...");
      router.push("/wallet");
    }
  }, [isAuthenticated, router]);

  if (!isVisible || !charityDetails) return null;

  return (
    <>
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-overlay z-50 bg-black bg-opacity-100">
        <div className="mb-4">
          <SuperMintLogo
            showText={true}
            textSize="48px"
            showIcon={true}
            iconSize="64px"
          />
        </div>
        <div className="p-4 rounded-lg shadow-lg max-w-md w-full">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Welcome</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Separator />
              <p className="text-center">
                Login with{" "}
                <span className="font-bold text-yellow-500">
                  {charityDetails.donorEmail}
                </span>{" "}
                to receive your NFT from{" "}
                <span className="font-bold text-blue-500">
                  {charityDetails.charityName || "the charity"}
                </span>
              </p>
              <div className="flex justify-center">
                <ConnectButton
                  chain={polygon}
                  client={client}
                  wallets={wallets}
                  connectButton={{ label: "Login" }}
                  connectModal={{
                    title: "Choose a login method",
                    size: "compact",
                    showThirdwebBranding: false,
                  }}
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
            </CardContent>
          </Card>
        </div>
      </div>
      {account && (
        <WelcomeModal
          isOpen={showWelcome}
          walletAddress={account.address}
          onClose={() => setShowWelcome(false)}
        />
      )}
    </>
  );
};

export default WelcomeMessage;
