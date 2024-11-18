"use client";

import { FC, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ConnectButton } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { polygon } from "thirdweb/chains";
import { client } from "@/lib/thirdweb/client";
import { useRouter } from "next/navigation";
import { useWalletAuth } from "@/hooks/use-wallet-auth";

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
  } = useWalletAuth();

  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is authenticated. Redirecting to /wallet...");
      router.push("/wallet");
    }
  }, [isAuthenticated, router]);

  if (!isVisible || !charityDetails) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-overlay z-50 bg-black bg-opacity-100">
      <div className="p-4 rounded-lg shadow-lg max-w-md w-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Welcome to SuperMint</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Separator />
            <p className="text-center">
              Login to{" "}
              <span className="font-semibold">{charityDetails.donorEmail}</span>{" "}
              to receive your NFT from{" "}
              <span className="font-semibold">
                {charityDetails.charityName || "the charity"}
              </span>
              .
            </p>
            <div className="flex justify-center">
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
  );
};

export default WelcomeMessage;
