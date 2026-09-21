import { createFileRoute } from "@tanstack/react-router";
import { ReviewScreen } from "@/components/review-screen";

export const Route = createFileRoute("/review")({
  head: () => ({ meta: [
    { title: "Review Queue — Averis" },
    { name: "description", content: "Audit and resolve shipping document discrepancies." },
    { property: "og:title", content: "Review Queue — Averis" },
    { property: "og:description", content: "Audit and resolve shipping document discrepancies." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ReviewScreen,
});