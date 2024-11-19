import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface WelcomeModalProps {
  isOpen: boolean;
  walletAddress: string;
  onComplete: (walletAddress: string) => Promise<void>;
}

export function WelcomeModal({
  isOpen,
  walletAddress,
  onComplete,
}: WelcomeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => onComplete(walletAddress)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Welcome to Supermint! 🎉
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <p>View and collect digital art while supporting charitable causes</p>
        </div>
        <DialogFooter>
          <Button onClick={() => onComplete(walletAddress)}>Get Started</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
