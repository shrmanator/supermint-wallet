// hooks/use-nfts.ts
import { useEffect, useState } from "react";
import useSWR from "swr";
import axios from "axios";
import { NftResponse } from "@/alchemy/nft-types";
import { NFTService } from "@/services/nft-service";
import { useWalletAuth } from "@/hooks/use-wallet-auth";
import { NFTResponse } from "@/types/nft-db-response";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useNfts(ownerAddress?: string) {
  const { userEmail } = useWalletAuth();

  // Blockchain NFT fetching with SWR
  const { data: alchemyData, error: alchemyError } = useSWR<NftResponse>(
    ownerAddress ? `/api/nfts?owner=${ownerAddress}` : null,
    fetcher
  );

  console.log("⛓️ Chain NFT Status:", {
    nftCount: alchemyData?.ownedNfts?.length || 0,
  });

  // State for database NFTs
  const [dbNfts, setDbNfts] = useState<NFTResponse[] | null>(null);
  const [dbError, setDbError] = useState<string | null>(null);
  const [isDbLoading, setIsDbLoading] = useState(false);

  // Fetch NFTs from the database
  useEffect(() => {
    const fetchDbNfts = async () => {
      if (!userEmail || (alchemyData && alchemyData.ownedNfts.length > 0)) {
        return; // Skip DB fetch if blockchain NFTs are found or no userEmail
      }

      setIsDbLoading(true);
      try {
        const nfts = await NFTService.getNFTsFromDb(userEmail);
        setDbNfts(nfts);
      } catch (error: unknown) {
        setDbError(error.message || "Failed to fetch NFTs from the database");
      } finally {
        setIsDbLoading(false);
      }
    };

    fetchDbNfts();
  }, [userEmail, alchemyData]);

  // Check if there are any entries in the database and their statuses
  console.log("🔍 Checking for database NFT statuses...", dbNfts);

  if (dbNfts) {
    dbNfts.forEach((nft, index) => {
      console.log(`NFT ${index + 1} Status:`, nft.status);
    });
  }

  const noDbEntries = !dbNfts || dbNfts.length === 0;

  // Check if there are pending or error NFTs
  const hasPendingNft =
    dbNfts?.some((nft) => {
      console.log(`Checking NFT status: ${nft.status}`);
      return nft.status === "PENDING";
    }) ?? false;

  const hasFailedNft =
    dbNfts?.some((nft) => {
      console.log(`Checking for error NFT: ${nft.status}`);
      return nft.status === "FAILED";
    }) ?? false;

  // Log the combined state for clarity
  console.log("📊 NFT Status:", {
    chainNfts: alchemyData?.ownedNfts?.length || 0,
    dbNftCount: dbNfts?.length || 0,
    hasPending: hasPendingNft,
    hasFailed: hasFailedNft,
    noDbEntries,
  });

  // Reflect this logic in the return object
  return {
    nftsData: alchemyData,
    nftsError: alchemyError || dbError,
    hasPendingNft,
    hasFailedNft,
    noDbEntries,
    isLoading:
      (!alchemyData && !alchemyError) ||
      (isDbLoading && alchemyData?.ownedNfts.length === 0),
    dbNfts,
    dbError,
  };
}
