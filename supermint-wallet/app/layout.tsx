import type { Metadata } from "next";
import { Inter, Dancing_Script, Space_Grotesk } from "next/font/google";
import { ThirdwebProvider } from "thirdweb/react";
import "@/app/globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import NavBar from "@/app/navbar";
import { CharityProvider } from "@/contexts/charity-context";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-dancing-script",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
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
      <head>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SuperMint Wallet" />
        <meta
          name="twitter:description"
          content="Transforming donations into collectible digital assets. SuperMint lets charities reward donors with unique NFTs, driving engagement and impact through cutting-edge blockchain technology."
        />
        <meta
          name="twitter:image"
          content="https://wallet.supermint.ca/supermint-icon.png"
        />
        <meta property="og:title" content="SuperMint Wallet" />
        <meta
          property="og:description"
          content="Transforming donations into collectible digital assets. SuperMint lets charities reward donors with unique NFTs, driving engagement and impact through cutting-edge blockchain technology."
        />
        <meta
          property="og:image"
          content="https://wallet.supermint.ca/supermint-icon.png"
        />
        <meta property="og:url" content="https://wallet.supermint.ca" />
        <meta property="og:site_name" content="SuperMint Wallet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          dancingScript.variable,
          spaceGrotesk.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThirdwebProvider>
            <CharityProvider>
              <div className="flex flex-col min-h-screen">
                {/* Fixed navbar container */}
                <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
                  <NavBar />
                </div>
                {/* Add padding to prevent content from hiding behind fixed navbar */}
                <main className="flex-grow pt-16">{children}</main>

                <footer className="border-t py-4">
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()}{" "}
                    <a
                      href="https://supermint.ca"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      SuperMint
                    </a>{" "}
                    Wallet
                  </div>
                </footer>
              </div>
            </CharityProvider>
          </ThirdwebProvider>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
