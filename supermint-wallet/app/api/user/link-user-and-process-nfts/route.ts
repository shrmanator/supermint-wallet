import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPERMINT_SITE_ADDRESS}/api/wallet/link-wallet-and-process-all-claims-via-api`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.INTERNAL_SERVICE_API_KEY!,
        },
        body: JSON.stringify(body),
      }
    );

    const result = await response.json();
    const isSuccess = response.status === 200;

    return NextResponse.json(
      {
        statusCode: response.status,
        message: result.message || "Operation completed",
        data: {
          success: isSuccess,
          message: result.data?.message || result.message || "",
        },
      },
      { status: response.status }
    );
  } catch (error) {
    console.error("Error linking wallet:", error);
    return NextResponse.json(
      {
        statusCode: 500,
        message: "Internal server error",
        data: {
          success: false,
          message: "Failed to link wallet",
        },
      },
      { status: 500 }
    );
  }
}
