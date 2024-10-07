import { useState, useEffect, useCallback } from "react";
import { useActiveAccount } from "thirdweb/react";
import { getUserEmail } from "thirdweb/wallets/in-app";
import { client } from "@/app/lib/thirdweb/client";
import {
  generatePayload,
  isLoggedIn,
  login,
  logout,
} from "app/actions/thirdweb-login";
import { thirdwebLinkWalletAndClaimNFT } from "app/lib/supermint/nftService";
import { VerifyLoginPayloadParams } from "thirdweb/auth";

// Updated interface for the NFT claim result
interface NFTClaimResult {
  statusCode: number;
  message: string;
  data?: {
    success: boolean;
    message: string;
  };
}

/**
 * Checks if the provided value is a valid `NFTClaimResult` object.
 *
 * An `NFTClaimResult` object has the following structure:
 *
 * {
 *   statusCode: number;
 *   message: string;
 *   data?: {
 *     success: boolean;
 *     message: string;
 *   };
 * }
 *
 *
 * This function ensures that the provided value has the expected shape and types for an `NFTClaimResult`.
 *
 * @param value The value to check.
 * @returns `true` if the value is a valid `NFTClaimResult`, `false` otherwise.
 */
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
    const loggedIn = await isLoggedIn();
    setIsAuthenticated(loggedIn);
    return loggedIn;
  }, []);

  const handleLinkWalletAndClaimNFT = useCallback(
    async (email: string, walletAddress: string) => {
      try {
        setClaimError(null);
        const result = await thirdwebLinkWalletAndClaimNFT({
          email,
          walletAddress,
          nftClaimToken: "DEPRECATED_VALUE",
        });

        if (isNFTClaimResult(result)) {
          setNftClaimResult(result);
          console.log("NFT claim result:", result);

          if (result.statusCode === 200) {
            if (result.data?.success) {
              console.log("NFT claim successful:", result.data.message);
            } else if (result.data) {
              console.log(
                "Wallet linked, but no NFT claimed:",
                result.data.message
              );
              setClaimError(result.data.message);
            } else {
              console.log("Wallet linked:", result.message);
            }
          } else {
            console.error("Error in NFT claim:", result.message);
            setClaimError(result.message);
          }
        } else {
          console.error("Unexpected NFT claim result structure:", result);
          setClaimError("Unexpected NFT claim result structure");
        }
      } catch (error) {
        console.error("Failed to link wallet and claim NFT:", error);
        setClaimError(error instanceof Error ? error.message : String(error));
      }
    },
    []
  );

  const handleDoLogin = useCallback(
    async (params: VerifyLoginPayloadParams) => {
      console.log("Logging in!");
      try {
        await login(params);
        const isLoggedIn = await checkAuthStatus();
        if (isLoggedIn) {
          const email = await fetchUserEmail();
          if (email && account) {
            await handleLinkWalletAndClaimNFT(email, account.address);
          } else {
            console.log("Email or wallet address not available for NFT claim");
          }
        }
      } catch (error) {
        console.error("Login error:", error);
      }
    },
    [checkAuthStatus, fetchUserEmail, account, handleLinkWalletAndClaimNFT]
  );

  const handleIsLoggedIn = useCallback(async (address: string) => {
    console.log("Checking if logged in!", { address });
    return await isLoggedIn();
  }, []);

  const handleGetLoginPayload = useCallback(
    async ({ address }: { address: string }) => generatePayload({ address }),
    []
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
    const initializeAuth = async () => {
      const isLoggedIn = await checkAuthStatus();
      if (isLoggedIn) {
        const email = await fetchUserEmail();
        if (email && account) {
          await handleLinkWalletAndClaimNFT(email, account.address);
        }
      }
    };

    initializeAuth();
  }, [checkAuthStatus, fetchUserEmail, account, handleLinkWalletAndClaimNFT]);

  return {
    userEmail,
    isAuthenticated,
    nftClaimResult,
    claimError,
    account,
    handleDoLogin,
    handleIsLoggedIn,
    handleGetLoginPayload,
    handleDoLogout,
  };
}
