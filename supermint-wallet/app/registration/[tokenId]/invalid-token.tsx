import Link from "next/link";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const InvalidTokenMessage = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Alert
      variant="destructive"
      className="flex flex-col items-center text-center"
    >
      <AlertTitle>Invalid Registration Token</AlertTitle>
      <AlertDescription>
        The token provided for registration is not valid. Please try the link
        provided in the original invitation or contact support for assistance.
      </AlertDescription>
      <Link href="/" passHref>
        <Button variant="secondary" className="mt-4">
          Return to Homepage
        </Button>
      </Link>
    </Alert>
  </div>
);

export default InvalidTokenMessage;
