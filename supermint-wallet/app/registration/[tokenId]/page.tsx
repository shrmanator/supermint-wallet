import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCharityAndDonorDetails } from "@/services/charity-donor-service";
import InvalidTokenMessage from "./invalid-token";

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

    return (
      <Card>
        <CardHeader>
          <CardTitle>Charity Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <span className="font-medium">Charity Name: </span>
            <span>{details.data.charityName}</span>
          </div>
          <div>
            <span className="font-medium">Donor Email: </span>
            <span>{details.data.donorEmail}</span>
          </div>
        </CardContent>
      </Card>
    );
  } catch (error) {
    return <InvalidTokenMessage />;
  }
}
