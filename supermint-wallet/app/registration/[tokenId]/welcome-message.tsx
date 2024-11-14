import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
            Use{" "}
            <span className="font-semibold">{charityDetails.donorEmail}</span>{" "}
            to receive your NFT from{" "}
            <span className="font-semibold">
              {charityDetails.charityName || "the charity"}
            </span>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeMessage;
