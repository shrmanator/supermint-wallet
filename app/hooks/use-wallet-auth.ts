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

export function useWalletAuth() {
  const [userEmail, setUserEmail] = useState<string | undefined>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [nftClaimResult, setNftClaimResult] = useState<any>(null);
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
          nftClaimToken: "DEPRECATED_VALUE", // Replace with actual token or fetch it dynamically
        });
        setNftClaimResult(result);
        console.log("NFT claim result:", result);
      } catch (error) {
        console.error("Failed to link wallet and claim NFT:", error);
        setClaimError(error instanceof Error ? error.message : String(error));
      }
    },
    []
  );

  const handleDoLogin = useCallback(
    async (params: any) => {
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
