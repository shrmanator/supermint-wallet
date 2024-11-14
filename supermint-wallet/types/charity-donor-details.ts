export interface CharityDonorDetails {
  statusCode: number;
  message: string;
  data: {
    charityName: string;
    donorEmail: string;
  };
}

export interface CharityDonorError {
  error: string;
  statusCode?: number;
  message?: string;
}
