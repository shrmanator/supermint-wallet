import React from "react";

interface DonationLayoutProps {
  children: React.ReactNode;
}

export default function DonationLayout({ children }: DonationLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col justify-center">
      <div className="container mx-auto">{children}</div>
    </div>
  );
}
