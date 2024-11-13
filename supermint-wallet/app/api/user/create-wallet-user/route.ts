import { NextResponse } from "next/server";
import { createWalletUser } from "@/services/walletService";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input if needed
    if (!body.walletAddress || !body.email || !body.name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await createWalletUser({
      walletAddress: body.walletAddress,
      email: body.email,
      name: body.name,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating wallet user:", error);
    return NextResponse.json(
      { error: "Failed to create wallet user" },
      { status: 500 }
    );
  }
}
