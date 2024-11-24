"use client";

import ThemeToggle from "@/app/theme-toggle";

export default function Footer() {
  return (
    <footer className="border-t py-2">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 items-center">
          {/* Empty left column for spacing */}
          <div />
          {/* Centered content */}
          <div className="text-sm text-muted-foreground text-center">
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
          {/* Right-aligned theme toggle */}
          <div className="flex justify-end">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
