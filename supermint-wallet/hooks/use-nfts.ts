import useSWR from "swr";
import axios from "axios";
import { NftResponse } from "@/alchemy/nft-types";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useNfts(ownerAddress?: string) {
  const { data, error } = useSWR<NftResponse>(
    ownerAddress ? `/api/nfts?owner=${ownerAddress}` : null,
    fetcher
  );
  console.log("NFT data:", data);
  return {
    nftsData: data,
    nftsError: error,
    isLoading: !data && !error,
  };
}
