export interface LinkWalletParams {
  email: string;
  walletAddress: string;
  nftClaimToken: string;
}

export interface NFTClaimResult {
  statusCode: number;
  message: string;
  data?: {
    success: boolean;
    message: string;
  };
}

export interface CreateWalletUserData {
  walletAddress: string;
  email: string;
  name: string;
}
