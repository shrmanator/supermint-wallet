import React, { useMemo } from "react";
import { Nft } from "@/types/alchemy/nft-types";
import NftSeriesDisplay from "./nft-series-display";
import NftSet from "./nft-set-display";

interface NftDisplayProps {
  nfts: Nft[];
}

interface SetInfo {
  setName: string;
  nfts: Nft[];
  setSize: number;
  charityName: string;
}

const NftDisplay: React.FC<NftDisplayProps> = ({ nfts }) => {
  const groupedNfts = useMemo(() => {
    const sets: { [setName: string]: SetInfo } = {};
    const individual: Nft[] = [];

    nfts.forEach((nft) => {
      const setInfo = nft.raw.metadata.supermint;
      if (setInfo && setInfo.isInSet && setInfo.setName) {
        if (!sets[setInfo.setName]) {
          const setSizeAttribute = nft.raw.metadata.attributes.find(
            (attr) => attr.trait_type === "Set Size"
          );
          const setSize = setSizeAttribute ? Number(setSizeAttribute.value) : 0;
          sets[setInfo.setName] = {
            setName: setInfo.setName,
            nfts: [],
            setSize,
            charityName: setInfo.charityName,
          };
        }
        sets[setInfo.setName].nfts.push(nft);
      } else {
        individual.push(nft);
      }
    });

    return { sets, individual };
  }, [nfts]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(groupedNfts.sets).map((setInfo) => (
          <div key={setInfo.setName} className="w-full max-w-md mx-auto">
            <NftSet
              setName={setInfo.setName}
              nfts={setInfo.nfts}
              setSize={setInfo.setSize}
              charityName={setInfo.charityName}
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {groupedNfts.individual.map((nft) => (
          <NftSeriesDisplay key={nft.tokenId} nft={nft} />
        ))}
      </div>
    </div>
  );
};

export default NftDisplay;