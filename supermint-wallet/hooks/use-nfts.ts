import useSWR from "swr";
import axios from "axios";
import { NftResponse } from "@/alchemy/nft-types";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function usePollingNFTs(ownerAddress?: string) {
  const {
    data: nftsData,
    error,
    mutate,
  } = useSWR<NftResponse>(
    ownerAddress ? `/api/nfts?owner=${ownerAddress}` : null,
    fetcher,
    {
      refreshInterval: (data: NftResponse | undefined) => {
        // If no NFTs found, check every 5 seconds
        if (!data?.ownedNfts?.length) {
          return 5000;
        }
        // Otherwise use SWR defaults
        return 0;
      },
      // Let SWR handle all other behaviors by default
    }
  );

  console.log("NFT Check:", {
    chainNfts: nftsData?.ownedNfts?.length || 0,
    isPolling: !nftsData?.ownedNfts?.length,
  });

  return {
    nftsData,
    error,
    isLoading: !nftsData && !error,
    refresh: () => mutate(),
  };
}
