// hooks/use-nfts.ts
import useSWR from "swr";
import axios from "axios";
import { NftResponse } from "@/alchemy/nft-types";
import { NFTService } from "@/services/nft-service";
import { useWalletAuth } from "@/hooks/use-wallet-auth";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useNfts(ownerAddress?: string) {
  const { userEmail } = useWalletAuth();

  console.log("🎬 Starting NFT check for:", { ownerAddress, userEmail });

  // Check Alchemy NFTs
  const { data: alchemyData, error: alchemyError } = useSWR<NftResponse>(
    ownerAddress ? `/api/nfts?owner=${ownerAddress}` : null,
    fetcher
  );

  console.log("⛓️ Chain NFT Status:", {
    hasData: !!alchemyData,
    nftCount: alchemyData?.ownedNfts?.length || 0,
    error: alchemyError ? String(alchemyError) : null,
  });

  // Determine if we need DB check
  const shouldCheckDb = alchemyData?.ownedNfts.length === 0 && userEmail;
  console.log("🔍 DB Check needed?", {
    shouldCheckDb,
    reason: !shouldCheckDb
      ? alchemyData?.ownedNfts.length
        ? "Has chain NFTs"
        : "No user email or chain data not loaded"
      : "No chain NFTs found, checking DB",
  });

  // Check DB if needed
  const { data: dbNfts, error: dbError } = useSWR(
    shouldCheckDb ? ["dbNfts", userEmail] : null,
    () => NFTService.getNFTsFromDb(userEmail!)
  );

  console.log("📊 Final NFT Status:", {
    chainNfts: alchemyData?.ownedNfts?.length || 0,
    dbNfts: dbNfts?.length || 0,
    error: alchemyError || dbError ? String(alchemyError || dbError) : null,
    isLoading:
      (!alchemyData && !alchemyError) || (shouldCheckDb && !dbNfts && !dbError),
  });

  return {
    nftsData: alchemyData,
    nftsError: alchemyError || dbError,
    hasPendingNfts: dbNfts?.length > 0,
    isLoading:
      (!alchemyData && !alchemyError) || (shouldCheckDb && !dbNfts && !dbError),
  };
}
