import React from "react";

interface DonationLayoutProps {
  children: React.ReactNode;
}

export default function DonationLayout({ children }: DonationLayoutProps) {
  return (
    <div className="min-h-screen bg-background py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-secondary/50 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-card shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="space-y-4">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
