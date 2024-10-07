// app/api/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_KEY = process.env.ALCHEMY_API_KEY;
const ALCHEMY_BASE_URL = "https://polygon-mainnet.g.alchemy.com/nft/v3";
const MAX_RETRIES = 3;
const BASE_DELAY = 1000; // 1 second

async function fetchNFTsForOwner(owner: string): Promise<any> {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const response = await axios.get(
        `${ALCHEMY_BASE_URL}/${API_KEY}/getNFTsForOwner`,
        {
          params: {
            owner,
            withMetadata: true,
            pageSize: 100,
          },
        }
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
