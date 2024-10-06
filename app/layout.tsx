import type { Metadata } from "next";
import { Inter, Dancing_Script } from "next/font/google";
import "@/app/ui/global.css";
import { ThirdwebProvider } from "thirdweb/react";
import { cn } from "@/app/lib/utils";
import { ThemeProvider } from "@/app/ui/theme-provider";
import WalletProvider from "@/app/WalletProvider";

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          dancingScript.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ThirdwebProvider>
            <WalletProvider>{children}</WalletProvider>
          </ThirdwebProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
