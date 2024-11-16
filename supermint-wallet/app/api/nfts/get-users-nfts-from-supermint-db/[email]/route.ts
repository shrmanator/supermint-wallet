import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { email: string } }
) {
  try {
    const { params } = context;
    const { email } = await params;

    const response = await fetch(
      `${process.env.SUPERMINT_SITE_ADDRESS}/api/wallet/donor/${email}/nfts`,
      {
        headers: {
          "x-api-key": process.env.INTERNAL_SERVICE_API_KEY!,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || "Failed to fetch NFTs" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching donor NFTs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
