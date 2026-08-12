import { createFileRoute, redirect } from "@tanstack/react-router";

const title = "OTA Buster — turn OTA guests into direct bookers | Directful";
const description =
  "The OTA guest journey as one workspace: every stage, its timing, its offer and how it performs.";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/ota-buster" });
  },
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});
