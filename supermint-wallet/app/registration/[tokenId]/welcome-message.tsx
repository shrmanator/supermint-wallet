// welcome-message.tsx
"use client";

import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ConnectButton } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { polygon } from "thirdweb/chains";
import { client } from "@/lib/thirdweb/client";
import { useRouter } from "next/navigation";

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

  // Define the onConnect callback
  const handleConnect = () => {
    router.push("/wallet");
  };

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
                onConnect={handleConnect} // Attach the onConnect callback
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WelcomeMessage;
