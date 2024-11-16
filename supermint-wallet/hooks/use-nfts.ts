import useSWR from "swr";
import axios from "axios";
import { NftResponse } from "@/alchemy/nft-types";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useNfts(ownerAddress?: string) {
  const { data: nftsData, error } = useSWR<NftResponse>(
    ownerAddress ? `/api/nfts?owner=${ownerAddress}` : null,
    fetcher
  );

  console.log("NFT Check:", {
    chainNfts: nftsData?.ownedNfts?.length || 0,
  });

  return {
    nftsData,
    error,
    isLoading: !nftsData && !error,
  };
}
