// app/api/user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const UserSchema = z.object({
  walletAddress: z.string().min(1),
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = UserSchema.parse(await request.json());
    const user = await prisma.user.upsert({
      where: { walletAddress: body.walletAddress },
      update: { email: body.email },
      create: body,
    });
    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const walletAddress = request.nextUrl.searchParams.get("walletAddress");
  if (!walletAddress)
    return NextResponse.json(
      { error: "Wallet address required" },
      { status: 400 }
    );

  const user = await prisma.user.findUnique({
    where: { walletAddress },
    include: { shownNFTs: true },
  });

  return user
    ? NextResponse.json(user)
    : NextResponse.json({ error: "User not found" }, { status: 404 });
}
