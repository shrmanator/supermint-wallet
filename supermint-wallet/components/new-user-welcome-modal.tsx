import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
  const handleComplete = async () => {
    await updateNewUserStatus(walletAddress, false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleComplete}>
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
          <Button onClick={handleComplete}>Get Started</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
