import React, { useMemo } from "react";
import NftCard from "@/components/nft-card/nft-card";
import NftSet from "./nft-set-display";
import { Nft } from "@/alchemy/nft-types";
import { NftCelebrationModal } from "@/app/wallet/nft-celebration-modal";
import { useDuplicateNfts } from "@/hooks/use-check-duplicate-nft";

interface NftDisplayProps {
  nfts: Nft[];
  newNfts?: Nft[];
}

const NftDisplay: React.FC<NftDisplayProps> = ({ nfts, newNfts = [] }) => {
  const { duplicateGroups } = useDuplicateNfts(nfts);

  const duplicateCounts = useMemo(() => {
    const counts = new Map<string, number>();
    duplicateGroups.forEach((group) => {
      const groupSize = group.length;
      group.forEach((nft) => {
        counts.set(nft.tokenId, groupSize);
      });
    });
    return counts;
  }, [duplicateGroups]);

  const groupedNfts = useMemo(() => {
    const sets = new Map<
      string,
      {
        nfts: Nft[];
        setSize: number;
        charityName: string;
      }
    >();
    const individual: Nft[] = [];

    // Filter duplicates, keeping only the first of each group
    const uniqueNfts = nfts.filter(
      (nft) =>
        !duplicateGroups.some(
          (group) => group.includes(nft) && group[0].tokenId !== nft.tokenId
        )
    );

    uniqueNfts.forEach((nft) => {
      const setInfo = nft.raw.metadata.supermint;
      if (setInfo?.isInSet && setInfo.setName) {
        const existing = sets.get(setInfo.setName);
        if (!existing) {
          const setSizeAttribute = nft.raw.metadata.attributes.find(
            (attr) => attr.trait_type === "Set Size"
          );
          const setSize = setSizeAttribute ? Number(setSizeAttribute.value) : 0;
          sets.set(setInfo.setName, {
            nfts: [nft],
            setSize,
            charityName: setInfo.charityName,
          });
        } else {
          existing.nfts.push(nft);
        }
      } else {
        individual.push(nft);
      }
    });

    const sortedSets = Array.from(sets.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([setName, info]) => ({
        ...info,
        setName,
      }));

    return { sets: sortedSets, individual };
  }, [nfts, duplicateGroups]);

  return (
    <>
      <div className="flex flex-col gap-6">
        {groupedNfts.sets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {groupedNfts.sets.map((setInfo) => (
              <NftSet
                key={setInfo.setName}
                nfts={setInfo.nfts}
                setSize={setInfo.setSize}
                charityName={setInfo.charityName}
                setName={setInfo.setName}
                duplicateCounts={duplicateCounts}
              />
            ))}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {groupedNfts.individual.map((nft) => (
            <div key={nft.tokenId}>
              <NftCard
                nft={nft}
                duplicateCount={duplicateCounts.get(nft.tokenId) || 1}
              />
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
