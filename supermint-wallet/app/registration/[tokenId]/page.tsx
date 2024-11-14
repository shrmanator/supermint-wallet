import { getCharityAndDonorDetails } from "@/services/charity-donor-service";
import InvalidTokenMessage from "./invalid-token";
import WelcomeMessage from "./welcome-message";

interface PageProps {
  params: Promise<{
    tokenId: string;
  }>;
}

export default async function CharityPage({ params }: PageProps) {
  const { tokenId } = await params;

  console.log("🚀 CharityPage - Starting page render with tokenId:", tokenId);

  try {
    const details = await getCharityAndDonorDetails(tokenId);

    if (!details.data) {
      throw new Error("No data found");
    }

    return (
      <WelcomeMessage
        charityDetails={{
          charityName: details.data.charityName,
          donorEmail: details.data.donorEmail,
        }}
        isVisible={true}
      />
    );
  } catch (error) {
    console.error("Error fetching charity details:", error);
    return <InvalidTokenMessage />;
  }
}
