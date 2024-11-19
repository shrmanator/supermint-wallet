import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Typewriter } from "react-simple-typewriter";

interface WelcomeModalProps {
  isOpen: boolean;
  walletAddress: string;
  onClose: () => void;
  onUpdateStatus: (address: string, isNew: boolean) => Promise<void>;
}

export function WelcomeModal({
  isOpen,
  walletAddress,
  onClose,
  onUpdateStatus,
}: WelcomeModalProps) {
  const [showCursor, setShowCursor] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await onUpdateStatus(walletAddress, false);
      onClose();
    } catch (error) {
      console.error("Failed to update user status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypeEnd = () => {
    setShowCursor(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}} modal>
      <DialogContent
        className="max-w-sm p-6"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="border-none">
          <DialogTitle className="text-xl font-bold">
            Your SuperMint Wallet is Ready! 🎉
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="text-zinc-300 min-h-12">
            <Typewriter
              words={[
                "Start collecting rare NFTs, complete special sets, and unlock new features! Your wallet is ready to receive unique digital rewards with every donation.",
              ]}
              cursor={showCursor}
              cursorStyle="_"
              typeSpeed={35}
              delaySpeed={1000}
              loop={1}
              onLoopDone={handleTypeEnd}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleComplete}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Loading..." : "Start Collecting"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default WelcomeModal;
