import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.SUPERMINT_SITE_ADDRESS;
const API_KEY = process.env.INTERNAL_SERVICE_API_KEY;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  const { tokenId } = await params;

  console.log("📡 API Route - Starting request for tokenId:", tokenId);

  try {
    const response = await fetch(
      `${API_URL}/api/wallet/detailsViaInternalApiKey/${tokenId}`,
      {
        headers: {
          "x-api-key": API_KEY || "",
        },
      }
    );

    console.log("🌐 API Route - Response received:", {
      status: response.status,
      ok: response.ok,
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ API Route - Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch charity details" },
      { status: 500 }
    );
  }
}
