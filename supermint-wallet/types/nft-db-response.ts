export type NFTResponse = {
  id: number;
  tokenId: string | null;
  mintedAt: string | null;
  donationAmount: number | null;
  nftClaimToken: string | null;
  metadataIpfsHash: string | null;
  donorEmail: string | null;
  claimed: boolean;
  status: string;
  seriesNumber: number | null;
  seriesTitle: string;
  artistName: string;
  description: string;
  charityName: string;
  setInfo: {
    title: string;
    description: string;
  } | null;
  walletAddress: string | null;
};
