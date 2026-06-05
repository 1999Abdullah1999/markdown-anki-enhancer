import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MD → Anki | Markdown Live Preview & Image Exporter" },
      { name: "description", content: "Paste Markdown from AI chatbots, preview live, and export sections as PNG images for Anki." },
      { property: "og:title", content: "MD → Anki" },
      { property: "og:description", content: "Markdown live preview + per-section PNG export. Arabic supported." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <iframe
      src="/md-anki.html"
      title="MD → Anki"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        border: "none",
      }}
    />
  );
}
