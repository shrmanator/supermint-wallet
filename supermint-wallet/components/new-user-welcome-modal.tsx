import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { updateNewUserStatus } from "@/actions/user";
import { Typewriter } from "react-simple-typewriter";
import Confetti from "react-confetti";

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
  const [showCursor, setShowCursor] = useState(true);

  const handleComplete = async () => {
    try {
      await updateNewUserStatus(walletAddress, false);
      onClose();
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };

  const message =
    "This is where your NFTs are stored after you make a donation. It's your personal collection, showcasing your support and contributions.";

  const handleTypeEnd = () => {
    setShowCursor(false); // Hide cursor when typing is complete
  };

  return (
    <>
      {isOpen && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={300}
        />
      )}
      <Dialog
        open={isOpen}
        onOpenChange={handleComplete}
        aria-label="Welcome Modal"
      >
        <DialogContent className="sm:max-w-md transition-transform duration-300 ease-out">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Welcome to Your Supermint Wallet! 🎉
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-zinc-300">
              <Typewriter
                words={[message]}
                cursor={showCursor}
                cursorStyle="_"
                typeSpeed={50}
                deleteSpeed={40}
                delaySpeed={3000}
                loop={1} // Type the message once
                onLoopDone={handleTypeEnd} // Callback when the loop is done
              />
            </p>
          </div>
          <DialogFooter>
            <Button onClick={handleComplete}>Get Started</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
