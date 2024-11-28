import { Nft } from "@/alchemy/nft-types";
import { useMemo } from "react";

export const useDuplicateNfts = (nfts: Nft[]) => {
  const duplicateGroups = useMemo(() => {
    const duplicates = new Map<string, Nft[]>();

    nfts.forEach((nft) => {
      const supermint = nft.raw?.metadata?.supermint;
      const key = JSON.stringify({
        seriesTitle: supermint?.seriesTitle,
        seriesArtistName: supermint?.seriesArtistName,
        setName: supermint?.setName,
        image: nft.raw?.metadata?.image,
      });

      if (!duplicates.has(key)) {
        duplicates.set(key, []);
      }
      duplicates.get(key)?.push(nft);
    });

    return Array.from(duplicates.values()).filter((group) => group.length > 1);
  }, [nfts]);

  const isDuplicate = useMemo(() => {
    const dupeMap = new Map<string, boolean>();

    duplicateGroups.forEach((group) => {
      group.forEach((nft) => {
        dupeMap.set(nft.tokenId, true);
      });
    });

    return (tokenId: string) => dupeMap.get(tokenId) ?? false;
  }, [duplicateGroups]);

  return {
    duplicateGroups,
    isDuplicate,
    hasDuplicates: duplicateGroups.length > 0,
    totalDuplicates: duplicateGroups.reduce(
      (acc, group) => acc + group.length,
      0
    ),
  };
};
