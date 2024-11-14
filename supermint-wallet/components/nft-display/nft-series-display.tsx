import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import NftCard from "@/components/nft-card/nft-card";
import { Nft } from "@/alchemy/nft-types";

interface NftSeriesDisplayProps {
  nft: Nft;
}

const NftSeriesDisplay: React.FC<NftSeriesDisplayProps> = ({ nft }) => {
  return (
    <Card className="overflow-hidden shadow-lg bg-card-background">
      <CardContent className="p-0">
        <NftCard nft={nft} />
      </CardContent>
    </Card>
  );
};

export default NftSeriesDisplay;
