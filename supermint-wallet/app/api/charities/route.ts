// app/api/charities/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Starting charity fetch...");

    const url =
      "http://localhost:5000/api/charity/all-charities-public-info-via-internal-api-key";
    const apiKey = process.env.INTERNAL_SERVICE_API_KEY;

    console.log("URL:", url);
    console.log("API Key exists:", !!apiKey);

    const response = await fetch(url, {
      headers: {
        "x-api-key": apiKey || "",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(
        `Failed to fetch charities: ${response.status} ${errorText}`
      );
    }

    const data = await response.json();
    console.log("Successfully fetched charities:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Detailed error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      error,
    });

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch charities",
      },
      { status: 500 }
    );
  }
}
