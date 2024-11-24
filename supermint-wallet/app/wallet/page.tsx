"use client";

import NftDisplay from "@/components/nft-display/nft-display";
import { usePollingNFTs } from "@/hooks/use-nfts";
import React, { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import FlickeringAsciiBanner from "@/components/flickering-sm-banner";
import PageError from "@/app/page-error";
import WalletHeader from "./wallet-header";
import EmptyWallet from "./empty-wallet";
import { Nft } from "@/alchemy/nft-types";
import { syncAndGetUnseenNFTs, markNFTsAsSeen } from "@/actions/db-nfts";
import { NewNftModal } from "./new-nft-modal";

export default function WalletPage() {
  const account = useActiveAccount();
  const { nftsData, error, isLoading } = usePollingNFTs(account?.address);
  const [unseenNfts, setUnseenNfts] = useState<Nft[]>([]);
  console.log("nftdata", nftsData);
  // Derive modal visibility from unseenNfts
  const showModal = unseenNfts.length > 0;

  useEffect(() => {
    async function checkUnseenNFTs() {
      if (nftsData && account?.address) {
        try {
          const unseenTokenIds = await syncAndGetUnseenNFTs({
            walletAddress: account.address,
            nftResponse: nftsData,
          });

          if (unseenTokenIds.length > 0) {
            const newUnseenNfts = nftsData.ownedNfts.filter((nft) =>
              unseenTokenIds.includes(nft.tokenId)
            );
            setUnseenNfts(newUnseenNfts);
          }
        } catch (error) {
          console.error("Error checking for unseen NFTs:", error);
        }
      }
    }

    checkUnseenNFTs();
  }, [nftsData, account?.address]);

  const handleModalClose = async () => {
    if (account?.address && unseenNfts.length > 0) {
      try {
        await markNFTsAsSeen({
          walletAddress: account.address,
          tokenIds: unseenNfts.map((nft) => nft.tokenId),
        });
        setUnseenNfts([]); // Just clear unseenNfts, modal will close automatically
      } catch (error) {
        console.error("Error marking NFTs as seen:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FlickeringAsciiBanner loopCount={Infinity} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <PageError message="Failed to fetch NFTs" />
      </div>
    );
  }

  const hasNfts = nftsData?.ownedNfts && nftsData.ownedNfts.length > 0;

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="mb-8">
            <WalletHeader />
          </div>
          {hasNfts ? <NftDisplay nfts={nftsData.ownedNfts} /> : <EmptyWallet />}
        </div>
      </div>

      <NewNftModal
        isOpen={showModal}
        onClose={handleModalClose}
        nfts={unseenNfts}
      />
    </>
  );
}
