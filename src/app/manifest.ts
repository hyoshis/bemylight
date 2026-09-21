import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return {
    name: "Be My Light",
    short_name: "Be My Light",
    description:
      "Peer connection, manageable tasks, and encouragement for people navigating health challenges and their supporters.",
    start_url: `${basePath}/home/`,
    display: "standalone",
    background_color: "#f7f0e4",
    theme_color: "#f7f0e4",
    icons: [
      {
        src: `${basePath}/icon.svg`,
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: `${basePath}/icon-maskable.svg`,
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
