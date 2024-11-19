// services/userService.ts
import { z } from "zod";

export const UserSchema = z.object({
  walletAddress: z.string().min(1),
  email: z.string().email(),
});

export type UserInput = z.infer<typeof UserSchema>;

export class UserService {
  static async upsertUser(data: UserInput) {
    const response = await fetch("/api/user/upsert-db-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Failed to upsert user");
    return response.json();
  }

  static async getUser(walletAddress: string) {
    const response = await fetch(`/api/user?walletAddress=${walletAddress}`);
    if (!response.ok) throw new Error("Failed to fetch user");
    return response.json();
  }
}
