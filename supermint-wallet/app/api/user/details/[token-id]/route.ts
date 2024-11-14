// app/api/wallet/details/[tokenId]/route.ts
import { NextRequest, NextResponse } from "next/server";

// Server-side service
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
const INTERNAL_API_KEY = process.env.INTERNAL_SERVICE_API_KEY;

async function getCharityAndDonorDetails(nftClaimToken: string) {
  const response = await fetch(
    `${BACKEND_URL}/api/wallet/detailsViaInternalApiKey/${nftClaimToken}`,
    {
      headers: {
        "x-api-key": INTERNAL_API_KEY || "",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function GET(
  request: NextRequest,
  { params }: { params: { tokenId: string } }
) {
  try {
    const { tokenId } = params;

    // UUID validation
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(tokenId)) {
      return NextResponse.json(
        { error: "Invalid token format" },
        { status: 400 }
      );
    }

    // Call the internal service with API key
    const details = await getCharityAndDonorDetails(tokenId);
    return NextResponse.json(details);
  } catch (error) {
    console.error("API route error:", error);

    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes("401")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (error.message.includes("404")) {
        return NextResponse.json(
          { error: "Details not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to fetch details" },
      { status: 500 }
    );
  }
}
