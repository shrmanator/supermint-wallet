"use client";
import React, { useEffect, useState, useCallback } from "react";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { polygon } from "thirdweb/chains";
import { getUserEmail } from "thirdweb/wallets/in-app";
import { client } from "app/lib/thirdweb/client";
import {
  generatePayload,
  isLoggedIn,
  login,
  logout,
} from "app/actions/thirdweb-login";
import { thirdwebLinkWalletAndClaimNFT } from "app/lib/supermint/nftService";
import SuperMintLogo from "./ui/supermint-logo/supermintLogo";

const wallets = [
  inAppWallet({
    auth: {
      options: ["google", "email"],
    },
  }),
];

export default function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
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
          nftClaimToken: "YOUR_NFT_CLAIM_TOKEN", // Replace with actual token or fetch it dynamically
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

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
            <div className="flex items-center h-full">
              <SuperMintLogo />
            </div>
            <ConnectButton
              chain={polygon}
              client={client}
              wallets={wallets}
              connectButton={{ label: "Login" }}
              connectModal={{
                title: "",
                size: "compact",
                showThirdwebBranding: false,
              }}
              auth={{
                isLoggedIn: handleIsLoggedIn,
                doLogin: handleDoLogin,
                getLoginPayload: handleGetLoginPayload,
                doLogout: handleDoLogout,
              }}
            />
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        {userEmail && <p>Logged in with: {userEmail}</p>}
        {account && <p>Wallet address: {account.address}</p>}
        {nftClaimResult && (
          <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded">
            <h3 className="font-bold">NFT Claim Result:</h3>
            <pre>{JSON.stringify(nftClaimResult, null, 2)}</pre>
          </div>
        )}
        {claimError && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded text-red-700">
            Error: {claimError}
          </div>
        )}
        {children}
      </main>
      <footer className="border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} SuperMint Wallet
        </div>
      </footer>
    </div>
  );
}
