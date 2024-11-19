"use server";

import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const UserSchema = z.object({
  walletAddress: z.string().min(1),
  email: z.string().email(),
});

export async function upsertUser(data: z.infer<typeof UserSchema>) {
  const parsed = UserSchema.parse(data);
  return prisma.user.upsert({
    where: { walletAddress: parsed.walletAddress },
    update: { email: parsed.email },
    create: { ...parsed, isNewUser: true },
  });
}

export async function updateNewUserStatus(
  walletAddress: string,
  isNewUser: boolean
) {
  return prisma.user.update({
    where: { walletAddress },
    data: { isNewUser },
  });
}

export async function getUser(walletAddress: string) {
  return prisma.user.findUnique({
    where: { walletAddress },
    include: { ownedNfts: true },
  });
}
