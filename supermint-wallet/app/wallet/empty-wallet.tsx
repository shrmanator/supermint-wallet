"use client";

import { Gift, ExternalLink } from "lucide-react";
import { Typewriter } from "react-simple-typewriter";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const BeaconPing = () => (
  <span className="relative flex items-center justify-center h-6 w-6 mr-4">
    <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-yellow-400 opacity-50"></span>
    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
  </span>
);

interface EmptyWalletProps {
  charitiesData?: {
    charities: Array<{
      name: string;
      websiteUrl?: string;
    }>;
  };
}

export default function EmptyWallet({ charitiesData }: EmptyWalletProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Alert className="border border-zinc-800 bg-black">
        <div className="flex items-center">
          <BeaconPing />
          <div>
            <AlertTitle className="text-white font-medium flex items-center">
              Let&apos;s Get Started.
            </AlertTitle>
            <AlertDescription className="text-yellow-400">
              <Typewriter
                words={[
                  "If you have made a donation, you'll receive an email when your NFT is ready.",
                ]}
                typeSpeed={50}
                cursor={false}
              />
            </AlertDescription>
          </div>
        </div>
      </Alert>

      <Card>
        <CardHeader className="space-y-6 items-center text-center">
          <Gift className="h-12 w-12 text-muted-foreground" />
          <div className="space-y-2">
            <CardTitle className="text-2xl">No NFTs Found</CardTitle>
            <CardDescription className="text-lg">
              Make your first donation to receive an NFT!
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground text-center">
            Choose a participating charity:
          </h3>

          {charitiesData?.charities && (
            <div className="relative">
              <ScrollArea className="h-[300px] rounded-md" type="always">
                <div className="space-y-2 pr-4">
                  {charitiesData.charities.map((charity) => (
                    <div
                      key={charity.name}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/50"
                    >
                      <span className="font-medium">{charity.name}</span>
                      {charity.websiteUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(charity.websiteUrl, "_blank")
                          }
                          className="ml-2 whitespace-nowrap"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit Site
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
