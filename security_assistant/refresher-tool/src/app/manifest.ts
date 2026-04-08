import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Security Architect Refresher",
    short_name: "SA Refresher",
    description: "Mobile-friendly security and compliance reference workflow.",
    start_url: "/",
    display: "standalone",
    background_color: "#eef3fa",
    theme_color: "#1f4f97",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
