/**
 * NFT fetching endpoint for Polygon network using Alchemy's API.
 * Includes rate limit handling with exponential backoff and enhanced filtering options.
 */

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { Nft } from "@/alchemy/nft-types";

const API_KEY = process.env.ALCHEMY_API_KEY;
const ALCHEMY_BASE_URL = "https://polygon-mainnet.g.alchemy.com/nft/v3";
const MAX_RETRIES = 3;
const BASE_DELAY = 1000;

/** Fetches NFTs for a given address with automatic retry on rate limits */
export async function GET(request: NextRequest) {
  const searchParams = new URL(request.url).searchParams;
  const owner = searchParams.get("owner");
  const contractAddresses = searchParams.getAll("contractAddresses[]");

  if (!owner) {
    return NextResponse.json(
      { error: "Owner address is required" },
      { status: 400 }
    );
  }

  try {
    const nftsData = await fetchNFTsForOwner(owner, contractAddresses);
    return NextResponse.json(nftsData);
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.message },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch NFTs" },
      { status: 500 }
    );
  }
}

/** Helper method that fetches NFTs from Alchemy API with retry logic for rate limits */
async function fetchNFTsForOwner(
  owner: string,
  contractAddresses: string[] = []
): Promise<Nft> {
  let retries = 0;

  const params = {
    owner,
    withMetadata: true,
    orderBy: "transferTime",
    excludeFilters: ["AIRDROPS"],
    pageSize: 100,
    ...(contractAddresses.length > 0 && { contractAddresses }),
  };

  while (retries < MAX_RETRIES) {
    try {
      const response = await axios.get<Nft>(
        `${ALCHEMY_BASE_URL}/${API_KEY}/getNFTsForOwner`,
        { params }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        retries++;
        const delay = BASE_DELAY * Math.pow(2, retries);
        console.log(`Rate limited. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }

  throw new Error("Max retries reached. Unable to fetch NFTs.");
}
