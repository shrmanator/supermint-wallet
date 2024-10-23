export default function Footer() {
    return (
      <footer className="border-t py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} SuperMint Wallet
        </div>
      </footer>
    );
  }