import { createFileRoute } from "@tanstack/react-router";
import { InboxScreen } from "@/components/inbox-screen";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Inbox — Averis" },
    { name: "description", content: "Review classified shipping document emails in Averis." },
    { property: "og:title", content: "Inbox — Averis" },
    { property: "og:description", content: "Review classified shipping document emails in Averis." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function Index() {
  return <InboxScreen />;
}
