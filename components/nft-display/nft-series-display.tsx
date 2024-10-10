import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Nft } from "@/types/alchemy/nft-types";
import NftCard from "@/components/nft-card/nft-card";

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
