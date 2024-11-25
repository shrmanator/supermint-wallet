import React, { useMemo } from "react";
import NftCard from "@/components/nft-card/nft-card";
import NftSet from "./nft-set-display";
import { Nft } from "@/alchemy/nft-types";
import { NftCelebrationModal } from "@/app/wallet/nft-celebration-modal";

interface NftDisplayProps {
  nfts: Nft[];
  newNfts?: Nft[];
}

const NftDisplay: React.FC<NftDisplayProps> = ({ nfts, newNfts = [] }) => {
  const groupedNfts = useMemo(() => {
    const sets: {
      [charityName: string]: {
        nfts: Nft[];
        setSize: number;
        charityName: string;
      };
    } = {};
    const individual: Nft[] = [];

    nfts.forEach((nft) => {
      const setInfo = nft.raw.metadata.supermint;
      if (setInfo && setInfo.isInSet) {
        if (!sets[setInfo.charityName]) {
          const setSizeAttribute = nft.raw.metadata.attributes.find(
            (attr) => attr.trait_type === "Set Size"
          );
          const setSize = setSizeAttribute ? Number(setSizeAttribute.value) : 0;
          sets[setInfo.charityName] = {
            nfts: [],
            setSize,
            charityName: setInfo.charityName,
          };
        }
        sets[setInfo.charityName].nfts.push(nft);
      } else {
        individual.push(nft);
      }
    });

    return { sets, individual };
  }, [nfts]);

  const setEntries = Object.values(groupedNfts.sets);

  return (
    <>
      <div className="flex flex-col gap-6">
        {setEntries.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {setEntries.map((setInfo) => {
              const setName =
                setInfo.nfts[0]?.raw?.metadata?.supermint?.setName ?? "";
              return (
                <NftSet
                  key={setInfo.charityName}
                  setName={setName}
                  {...setInfo}
                />
              );
            })}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {groupedNfts.individual.map((nft) => (
            <div key={nft.tokenId}>
              <NftCard nft={nft} />
            </div>
          ))}
        </div>
      </div>

      {newNfts.length > 0 && (
        <NftCelebrationModal isOpen={true} onClose={() => {}} nfts={newNfts} />
      )}
    </>
  );
};

export default NftDisplay;