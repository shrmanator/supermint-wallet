/**
 * @fileoverview API endpoint for fetching NFTs owned by a specific address on the Polygon network
 * using Alchemy's NFT API. Implements error handling and exponential backoff retry logic
 * for rate limiting scenarios.
 */

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { AlchemyNFTResponse } from "./types";

/** Alchemy API key from environment variables */
const API_KEY = process.env.ALCHEMY_API_KEY;
/** Base URL for Alchemy's NFT API on Polygon mainnet */
const ALCHEMY_BASE_URL = "https://polygon-mainnet.g.alchemy.com/nft/v3";
/** Maximum number of retry attempts for failed requests */
const MAX_RETRIES = 3;
/** Base delay in milliseconds for exponential backoff */
const BASE_DELAY = 1000; // 1 second

/**
 * GET endpoint handler for fetching NFTs owned by a specific address
 *
 * @param request - NextRequest object containing the request details
 * @returns NextResponse with either the NFT data or an error message
 *
 * @example
 * GET /api/nfts?owner=0x123...abc
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get("owner");

  if (!owner) {
    return NextResponse.json(
      { error: "Owner address is required" },
      { status: 400 }
    );
  }

  try {
    const nftsData = await fetchNFTsForOwner(owner);
    return NextResponse.json(nftsData);
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.message },
        { status: error.response?.status || 500 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to fetch NFTs" },
        { status: 500 }
      );
    }
  }
}

/**
 * Fetches NFTs for a given owner address from Alchemy's API with retry logic
 *
 * @param owner - Ethereum address of the NFT owner
 * @returns Promise resolving to the NFT data
 * @throws Error if max retries are reached or other errors occur
 *
 * Implementation details:
 * - Uses exponential backoff for rate limit retries
 * - Includes metadata in the response
 * - Limits to 100 NFTs per request
 */
async function fetchNFTsForOwner(owner: string): Promise<AlchemyNFTResponse> {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const response = await axios.get<AlchemyNFTResponse>(
        `${ALCHEMY_BASE_URL}/${API_KEY}/getNFTsForOwner`,
        {
          params: {
            owner,
            withMetadata: true,
            pageSize: 100,
          },
        }
      );
      console.log("Fetched NFTs:", response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        retries++;
        const delay = BASE_DELAY * Math.pow(2, retries); // Exponential backoff
        console.log(`Rate limited. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }

  throw new Error("Max retries reached. Unable to fetch NFTs.");
}
