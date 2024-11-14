// app/charity/[tokenId]/page.tsx
import { charityDonorService } from "@/services/charity-donor-service";
import { CharityDonorDetails } from "@/types/charity-donor-details";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PageProps {
  params: {
    tokenId: string;
  };
}

export default async function CharityPage({ params }: PageProps) {
  console.log("🚀 CharityPage - Starting page render with params:", params);

  try {
    console.log(
      "📍 CharityPage - Attempting to fetch details for tokenId:",
      params.tokenId
    );

    const startTime = performance.now();
    const details: CharityDonorDetails =
      await charityDonorService.getCharityAndDonorDetails(params.tokenId);
    const endTime = performance.now();

    console.log("✅ CharityPage - Successfully fetched details:", {
      timeElapsed: `${(endTime - startTime).toFixed(2)}ms`,
      statusCode: details.statusCode,
      charityName: details.data.charityName,
      // Masking email for privacy in logs
      donorEmail: details.data.donorEmail.replace(/(?<=.{3}).(?=.*@)/g, "*"),
    });

    console.log("🎨 CharityPage - Rendering success state");
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
    console.error("❌ CharityPage - Error fetching details:", {
      tokenId: params.tokenId,
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error,
      timestamp: new Date().toISOString(),
    });

    // Log additional context if available
    if (error instanceof Response) {
      console.error("🌐 CharityPage - API Response details:", {
        status: error.status,
        statusText: error.statusText,
        url: error.url,
      });
    }

    console.log("🎨 CharityPage - Rendering error state");
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load charity details
          {process.env.NODE_ENV === "development" && error instanceof Error && (
            <div className="mt-2 text-xs opacity-75">{error.message}</div>
          )}
        </AlertDescription>
      </Alert>
    );
  } finally {
    console.log("🏁 CharityPage - Completed page render attempt");
  }
}
