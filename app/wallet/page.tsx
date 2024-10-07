"use client";

import { useActiveAccount, MediaRenderer } from "thirdweb/react";
import useSWR from "swr";
import axios from "axios";
import { useEffect, useState } from "react";
import { client } from "@/app/lib/thirdweb/client";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function WalletPage() {
  const account = useActiveAccount();

  const {
    data: nftsData,
    error: nftsError,
    isLoading: isNftsLoading,
  } = useSWR(
    account?.address ? `/api/nfts?owner=${account.address}` : null,
    fetcher
  );

  const [imageErrors] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (nftsData) {
      console.log("NFTs Data:", nftsData);
    }
  }, [nftsData]);

  const getProxiedImageUrl = (originalUrl: string) => {
    return `/api/image-proxy?url=${encodeURIComponent(originalUrl)}`;
  };

  return (
    <div>
      {isNftsLoading ? (
        <p>Loading NFTs...</p>
      ) : nftsError ? (
        <p>Error: {nftsError.message || "Failed to fetch NFTs"}</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {(nftsData?.ownedNfts || []).map((nft: any) => (
            <li
              key={nft.tokenId}
              style={{
                marginBottom: "20px",
                border: "1px solid #ccc",
                padding: "10px",
              }}
            >
              <h3>{nft.name || `NFT #${nft.tokenId}`}</h3>
              {!imageErrors[nft.tokenId] ? (
                <MediaRenderer
                  client={client}
                  src={getProxiedImageUrl(nft.image.cachedUrl || nft.tokenUri)}
                  alt={nft.name || `NFT #${nft.tokenId}`}
                  width="200px"
                  height="200px"
                />
              ) : (
                <p>Failed to load image</p>
              )}
              <p>
                <strong>Description:</strong> {nft.description}
              </p>
              <p>
                <strong>Token ID:</strong> {nft.tokenId}
              </p>
              <p>
                <strong>Contract:</strong> {nft.contract.address}
              </p>
              <p>
                <strong>Token Type:</strong> {nft.tokenType}
              </p>
              <p>
                <strong>Balance:</strong> {nft.balance}
              </p>
              {nft.mint && (
                <p>
                  <strong>Minted:</strong>{" "}
                  {new Date(nft.mint.timestamp).toLocaleString()}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
