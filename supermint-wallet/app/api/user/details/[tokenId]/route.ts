import { NextRequest, NextResponse } from "next/server";

// Environment variable validation
const API_URL = process.env.SUPERMINT_SITE_ADDRESS;
const API_KEY = process.env.INTERNAL_SERVICE_API_KEY;

// Helper function to validate environment variables
function validateEnvironment(): { isValid: boolean; error?: string } {
  if (!API_URL) {
    return {
      isValid: false,
      error: "Missing SUPERMINT_SITE_ADDRESS environment variable",
    };
  }

  if (!API_KEY) {
    return {
      isValid: false,
      error: "Missing INTERNAL_SERVICE_API_KEY environment variable",
    };
  }

  return { isValid: true };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  // Validate environment variables first
  const envValidation = validateEnvironment();
  if (!envValidation.isValid) {
    console.error("⚠️ API Route - Environment Error:", envValidation.error);
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

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

    // Handle different types of errors with appropriate status codes
    if (!response.ok) {
      const status = response.status;
      let errorMessage = "Failed to fetch charity details";

      switch (status) {
        case 401:
          errorMessage = "Invalid API key";
          break;
        case 404:
          errorMessage = "Charity details not found";
          break;
        case 403:
          errorMessage = "Access forbidden";
          break;
        default:
          errorMessage = `API error: ${status}`;
      }

      return NextResponse.json({ error: errorMessage }, { status });
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
