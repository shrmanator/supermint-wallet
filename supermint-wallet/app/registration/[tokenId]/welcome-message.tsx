"use client";

import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ConnectButton } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { polygon } from "thirdweb/chains";
import { client } from "@/lib/thirdweb/client";

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
  if (!isVisible || !charityDetails) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <Card className="w-full max-w-md mx-auto">
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
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeMessage;
