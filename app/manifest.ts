import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skijobs.net";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SkiJobs – Ski Resort Jobs",
    short_name: "SkiJobs",
    description: "Find ski resort jobs at 47+ mountains. Vail, Alterra, Boyne & Powdr Resorts.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#0f172a",
    orientation: "portrait-primary",
    scope: "/",
    id: `${baseUrl}/`,
    icons: [
      { src: "/icon", type: "image/png", sizes: "32x32", purpose: "any" },
      { src: "/apple-icon", type: "image/png", sizes: "180x180", purpose: "any" },
    ],
    categories: ["jobs", "business"],
  };
}
