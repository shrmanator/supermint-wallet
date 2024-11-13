import { linkWalletAndProcessClaims } from "@/services/walletService";
import { ApiError } from "@/types/errors";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.email || !body.walletAddress || !body.nftClaimToken) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await linkWalletAndProcessClaims({
      email: body.email,
      walletAddress: body.walletAddress,
      nftClaimToken: body.nftClaimToken,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error linking wallet and processing claims:", error);

    // Type guard to check if error is an ApiError
    const apiError = error as ApiError;

    return NextResponse.json(
      { error: apiError.message || "Failed to process request" },
      { status: apiError.status || 500 }
    );
  }
}
