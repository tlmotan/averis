import { createFileRoute, notFound } from "@tanstack/react-router";
import { ComparisonScreen } from "@/components/comparison-screen";
import { classificationData } from "@/data/averis-data";

export const Route = createFileRoute("/comparison/$emailId")({
  loader: ({ params }) => {
    const email = classificationData[params.emailId];
    if (!email || email.category !== "comparison_request") throw notFound();
    return { email };
  },
  head: ({ loaderData }) => ({ meta: [
    { title: loaderData ? `Comparison ${loaderData.email.email_id} — Averis` : "Comparison unavailable — Averis" },
    { name: "description", content: "Compare Shipping Instruction and Bill of Lading fields." },
    { property: "og:title", content: "Shipping Document Comparison — Averis" },
    { property: "og:description", content: "Compare Shipping Instruction and Bill of Lading fields." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ComparisonPage,
});

function ComparisonPage() {
  const { email } = Route.useLoaderData();
  return <ComparisonScreen email={email} />;
}