import type { Metadata } from "next";
import { Inter, Dancing_Script } from "next/font/google";
import { ThirdwebProvider } from "thirdweb/react";
import "@/components/ui/global.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import NavBar from "@/app/layouts/navbar";

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
      <head>
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SuperMint Wallet" />
        <meta
          name="twitter:description"
          content="Transforming donations into collectible digital assets. SuperMint lets charities reward donors with unique NFTs, driving engagement and impact through cutting-edge blockchain technology."
        />
        <meta
          name="twitter:image"
          content="https://supermintwallet.com/path-to-your-image.jpg"
        />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="SuperMint Wallet" />
        <meta
          property="og:description"
          content="Transforming donations into collectible digital assets. SuperMint lets charities reward donors with unique NFTs, driving engagement and impact through cutting-edge blockchain technology."
        />
        <meta
          property="og:image"
          content="https://supermintwallet.com/path-to-your-image.jpg"
        />
        <meta property="og:url" content="https://supermintwallet.com" />
        <meta property="og:site_name" content="SuperMint Wallet" />

        {/* Optional Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          dancingScript.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThirdwebProvider>
            <NavBar>{children}</NavBar>
            <footer className="border-t py-4 mt-auto">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} SuperMint Wallet
              </div>
            </footer>
          </ThirdwebProvider>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
