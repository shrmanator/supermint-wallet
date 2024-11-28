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

  // Create map of original NFTs and their copy counts
  const { uniqueNfts, copyCounts } = useMemo(() => {
    const counts = new Map<string, number>();
    const originals = new Map<string, Nft>();

    duplicateGroups.forEach((group) => {
      const key = JSON.stringify({
        seriesTitle: group[0].raw?.metadata?.supermint?.seriesTitle,
        seriesArtistName: group[0].raw?.metadata?.supermint?.seriesArtistName,
        setName: group[0].raw?.metadata?.supermint?.setName,
        image: group[0].raw?.metadata?.image,
      });
      counts.set(key, group.length);
      originals.set(key, group[0]);
    });

    const uniqueNfts = nfts.filter((nft) => {
      const key = JSON.stringify({
        seriesTitle: nft.raw?.metadata?.supermint?.seriesTitle,
        seriesArtistName: nft.raw?.metadata?.supermint?.seriesArtistName,
        setName: nft.raw?.metadata?.supermint?.setName,
        image: nft.raw?.metadata?.image,
      });
      // Keep only the first occurrence of each unique NFT
      return !counts.has(key) || originals.get(key)?.tokenId === nft.tokenId;
    });

    return { uniqueNfts, copyCounts: counts };
  }, [nfts, duplicateGroups]);

  const getCopyCount = (nft: Nft) => {
    const key = JSON.stringify({
      seriesTitle: nft.raw?.metadata?.supermint?.seriesTitle,
      seriesArtistName: nft.raw?.metadata?.supermint?.seriesArtistName,
      setName: nft.raw?.metadata?.supermint?.setName,
      image: nft.raw?.metadata?.image,
    });
    return copyCounts.get(key) || 1;
  };

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
  }, [uniqueNfts]);

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
              />
            ))}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {groupedNfts.individual.map((nft) => (
            <div key={nft.tokenId}>
              <NftCard nft={nft} duplicateCount={getCopyCount(nft)} />
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
