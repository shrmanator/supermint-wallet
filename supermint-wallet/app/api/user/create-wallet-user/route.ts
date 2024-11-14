import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(
      `${process.env.SUPERMINT_SITE_ADDRESS}/api/wallet/create-internal`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.INTERNAL_SERVICE_API_KEY!,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to create wallet user: ${response.status}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error creating wallet user:", error);
    return NextResponse.json(
      { error: "Failed to create wallet user" },
      { status: 500 }
    );
  }
}
