import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Missing URL parameter" },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });

    const contentType = response.headers["content-type"];

    return new NextResponse(response.data, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error proxying image:", error);
    return NextResponse.json(
      { error: "Error fetching image" },
      { status: 500 }
    );
  }
}
