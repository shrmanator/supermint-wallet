import type { Metadata } from "next";
import { Inter, Dancing_Script } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import WalletLayout from "./components/WalletLayout";
import { cn } from "lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-dancing-script",
});

export const metadata: Metadata = {
  title: "SuperMint Wallet",
  description:
    "Transforming donations into collectible digital assets. SuperMint lets charities reward donors with unique NFTs, driving engagement and impact through cutting-edge blockchain technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("dark", inter.variable, dancingScript.variable)}
    >
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
      >
        <ThirdwebProvider>
          <WalletLayout>{children}</WalletLayout>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
