export async function createWalletUser(userData: {
  walletAddress: string;
  email: string;
  name: string;
}) {
  const response = await fetch("http://localhost:5000/api/internal/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.INTERNAL_SERVICE_KEY!,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return response.json();
}

interface LinkWalletData {
  email: string;
  walletAddress: string;
  nftClaimToken: string;
}

export async function linkWalletAndProcessClaims(data: LinkWalletData) {
  const response = await fetch(
    "http://localhost:5000/api/link-wallet-and-process-all-claims-via-api",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.INTERNAL_SERVICE_KEY!,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Failed to link wallet and process claims"
    );
  }

  return response.json();
}
