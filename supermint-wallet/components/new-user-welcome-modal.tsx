import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Gift,
  Puzzle,
  Sparkle,
  Medal,
  Diamond,
  ArrowLeftRight,
  MousePointerClick,
} from "lucide-react";
import { updateNewUserStatus } from "@/actions/user";

interface WelcomeModalProps {
  isOpen: boolean;
  walletAddress: string;
  onClose: () => void;
}

export function WelcomeModal({
  isOpen,
  walletAddress,
  onClose,
}: WelcomeModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: <Heart className="w-16 h-16 text-pink-500" />,
      title: "Welcome to Supermint! 🎮",
      message: "Make donations, unlock surprise NFTs",
    },
    {
      icon: <Medal className="w-16 h-16 text-yellow-500" />,
      title: "Your Impact Badge! 🏆",
      message:
        "Each NFT is your unique digital collectible that proves your donation forever!",
      highlight: "One-of-a-kind digital collectible",
    },
    {
      icon: <Gift className="w-16 h-16 text-blue-500" />,
      title: "How to Get NFTs?",
      message:
        "Look for the SuperMint 'Get NFT' button when donating. Your NFTs will be sent here automatically!",
    },
    {
      icon: <Diamond className="w-16 h-16 text-purple-500" />,
      title: "Limited Edition NFTs! 💎",
      message:
        "Many NFTs are rare and limited in number. The more unique, the more collectors want them!",
      examples: ["Common ⭐", "Rare ⭐⭐", "Epic ⭐⭐⭐", "Legendary ⭐⭐⭐⭐"],
    },
    {
      icon: <Puzzle className="w-16 h-16 text-blue-500" />,
      title: "Sets & Collections! 🧩",
      message:
        "Some NFTs are part of amazing sets, while others are special standalone pieces.",
      highlight: "Complete sets for rewards (coming soon)!",
    },
    {
      icon: <ArrowLeftRight className="w-16 h-16 text-green-500" />,
      title: "Trade NFTs! 🤝",
      message:
        "Missed an NFT from a past series? Want to complete your set? Trade with other collectors!",
    },
    {
      icon: <Sparkle className="w-16 h-16 text-yellow-500" />,
      title: "This Is Just The Start! 🚀",
      message:
        "We're just getting started! New types of NFTs and exciting features are on the way.",
      highlight: "Keep donating and collecting!",
    },
  ];

  const handleComplete = async () => {
    if (currentStep === steps.length - 1) {
      try {
        await updateNewUserStatus(walletAddress, false);
        onClose();
      } catch (error) {
        console.error("Failed to update user status:", error);
      }
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 99 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 animate-gradient" />
        </div>
      )}
      <Dialog
        open={isOpen}
        onOpenChange={() => {
          if (currentStep === steps.length - 1) {
            handleComplete();
          }
        }}
        aria-label="Welcome Modal"
      >
        <DialogContent
          className="sm:max-w-md transition-transform duration-300 ease-out bg-black border border-zinc-800 [&>button]:hidden"
          onPointerDownOutside={(e) => {
            e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            e.preventDefault();
          }}
        >
          {/* Step progress */}
          <div className="flex justify-center gap-2 my-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep ? "bg-blue-500 w-8" : "bg-zinc-800 w-4"
                }`}
              />
            ))}
          </div>

          {/* Current step content */}
          <div className="min-h-48 flex items-center justify-center py-8">
            <div className="text-center space-y-6">
              <div className="flex justify-center mb-6 animate-bounce">
                {steps[currentStep].icon}
              </div>

              <h3 className="text-2xl font-bold text-white">
                {steps[currentStep].title}
              </h3>

              {steps[currentStep].message && (
                <p className="text-zinc-300 text-xl">
                  {steps[currentStep].message}
                </p>
              )}

              {steps[currentStep].examples && (
                <div className="flex flex-wrap justify-center gap-3 mt-4">
                  {steps[currentStep].examples.map((example, i) => (
                    <span
                      key={i}
                      className="text-lg px-4 py-2 bg-zinc-900 text-zinc-300 rounded-full border border-zinc-800"
                    >
                      {example}
                    </span>
                  ))}
                </div>
              )}

              {steps[currentStep].highlight && (
                <div className="mt-4">
                  <span className="text-lg px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full">
                    {steps[currentStep].highlight}
                  </span>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-zinc-800">
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button
                variant="outline"
                onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                className="bg-transparent border-zinc-700 text-white hover:bg-zinc-900 w-full text-lg font-medium"
                disabled={currentStep === 0}
              >
                Back
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button
                  onClick={() => setCurrentStep((s) => s + 1)}
                  className="bg-blue-600 hover:bg-blue-700 w-full text-lg font-semibold text-white shadow-lg shadow-blue-500/20"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  className="bg-blue-600 hover:bg-blue-700 w-full text-lg font-semibold text-white shadow-lg shadow-blue-500/20"
                >
                  Let&apos;s Go!
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
