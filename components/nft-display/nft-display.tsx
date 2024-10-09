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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.values(groupedNfts.sets).map((setInfo) => (
          <NftSet
            key={setInfo.setName}
            setName={setInfo.setName}
            nfts={setInfo.nfts}
            setSize={setInfo.setSize}
            charityName={setInfo.charityName}
          />
        ))}
      </div>

      {groupedNfts.individual.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Individual NFTs</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {groupedNfts.individual.map((nft) => (
              <NftSeriesDisplay key={nft.tokenId} nft={nft} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NftDisplay;
