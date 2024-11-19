import { useState, useEffect, useCallback } from "react";
import { useActiveAccount } from "thirdweb/react";
import { VerifyLoginPayloadParams } from "thirdweb/auth";
import { getUserEmail } from "thirdweb/wallets/in-app";
import { client } from "@/lib/thirdweb/client";
import {
  generatePayload,
  isLoggedIn,
  login,
  logout,
} from "@/actions/thirdweb-login";
import {
  createWalletUser,
  linkWalletAndClaimNFTs,
} from "@/services/wallet-service";
import { upsertUser } from "@/actions/user";
import { User } from "@prisma/client";

interface NFTClaimResult {
  statusCode: number;
  message: string;
  data?: {
    success: boolean;
    message: string;
  };
}

function isNFTClaimResult(value: unknown): value is NFTClaimResult {
  return (
    typeof value === "object" &&
    value !== null &&
    "statusCode" in value &&
    "message" in value &&
    (!("data" in value) ||
      (typeof (value as NFTClaimResult).data === "object" &&
        (value as NFTClaimResult).data !== null &&
        "success" in ((value as NFTClaimResult).data ?? {}) &&
        "message" in ((value as NFTClaimResult).data ?? {})))
  );
}

export function useWalletAuth() {
  const [userData, setUserData] = useState<User | null>(null);
  const [userEmail, setUserEmail] = useState<string | undefined>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [nftClaimResult, setNftClaimResult] = useState<NFTClaimResult | null>(
    null
  );
  const [claimError, setClaimError] = useState<string | null>(null);
  const account = useActiveAccount();

  const fetchUserEmail = useCallback(async () => {
    try {
      const email = await getUserEmail({ client });
      setUserEmail(email);
      console.log("User's email:", email);
      return email;
    } catch (error) {
      console.error("Error fetching user email:", error);
      return undefined;
    }
  }, []);

  const checkAuthStatus = useCallback(async () => {
    console.log("Checking authentication status...");
    const loggedIn = await isLoggedIn();
    console.log("Logged in:", loggedIn);
    setIsAuthenticated(loggedIn);
    return loggedIn;
  }, []);

  const handleLinkWalletAndClaimNFT = useCallback(
    async (email: string, walletAddress: string) => {
      setClaimError(null);

      const handleError = (message: string, errorData?: unknown) => {
        console.error(message, errorData || "");
        setClaimError(message);
      };

      try {
        // Always call upsert first - it'll handle both new and existing users
        console.log("Upserting wallet user...");
        await createWalletUser({
          email,
          walletAddress,
          name: email.split("@")[0],
        });
        console.log("Wallet user upserted successfully!");

        const result = await linkWalletAndClaimNFTs({
          email,
          walletAddress,
          nftClaimToken: "DEPRECATED_VALUE", // keeping this for compatibility
        });

        if (!isNFTClaimResult(result)) {
          handleError("Unexpected NFT claim result structure", result);
          return;
        }

        if (result.statusCode !== 200) {
          handleError(`Error in NFT claim: ${result.message}`);
          return;
        }

        setNftClaimResult(result);
        console.log("NFT claim result:", result);

        const message = result.data?.message || result.message;

        if (result.data?.success) {
          console.log("NFT claim successful:", message);
        } else {
          console.log("Wallet linked, but no NFT claimed:", message);
          setClaimError(message);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        handleError(`Failed to link wallet and claim NFT: ${errorMessage}`);
      }
    },
    [setClaimError, setNftClaimResult]
  );

  const authenticateAndClaimNFT = useCallback(async () => {
    const loggedIn = await checkAuthStatus();
    if (loggedIn) {
      const email = await fetchUserEmail();
      if (email && account) {
        await handleLinkWalletAndClaimNFT(email, account.address);
      } else {
        console.log("Email or wallet address not available for NFT claim");
      }
    }
  }, [checkAuthStatus, fetchUserEmail, account, handleLinkWalletAndClaimNFT]);

  const handleDoLogin = useCallback(
    async (params: VerifyLoginPayloadParams) => {
      try {
        await login(params);
        const email = await fetchUserEmail();
        if (email && account) {
          const user = await upsertUser({
            walletAddress: account.address,
            email,
          });
          setUserData(user); // Store user data including isNewUser
        }
        await authenticateAndClaimNFT();
      } catch (error) {
        console.error("Login error:", error);
      }
    },
    [authenticateAndClaimNFT, fetchUserEmail, account]
  );

  const handleDoLogout = useCallback(async () => {
    console.log("Logging out!");
    await logout();
    setUserEmail(undefined);
    setIsAuthenticated(false);
    setNftClaimResult(null);
    setClaimError(null);
  }, []);

  useEffect(() => {
    authenticateAndClaimNFT();
  }, [authenticateAndClaimNFT]);

  return {
    userEmail,
    isAuthenticated,
    checkAuthStatus,
    nftClaimResult,
    claimError,
    account,
    handleDoLogin,
    isLoggedIn,
    generatePayload,
    handleDoLogout,
    isNewUser: userData?.isNewUser,
  };
}
