import React, { useMemo } from "react";
import NftCard from "@/components/nft-card/nft-card";
import NftSet from "./nft-set-display";
import { Nft } from "@/alchemy/nft-types";

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

  const setEntries = Object.values(groupedNfts.sets);

  return (
    <div className="flex flex-col gap-6">
      {setEntries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {setEntries.map((setInfo) => (
            <NftSet key={setInfo.setName} {...setInfo} />
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {groupedNfts.individual.map((nft) => (
          <NftCard key={nft.tokenId} nft={nft} />
        ))}
      </div>
    </div>
  );
};

export default NftDisplay;
