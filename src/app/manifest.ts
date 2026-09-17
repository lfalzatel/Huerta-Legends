import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HuertaHéroes — Sistema Orgánico Gamificado",
    short_name: "HuertaHéroes",
    description: "Gestión gamificada de huerta orgánica con Cloud Firestore y Firebase Auth.",
    start_url: "/",
    display: "standalone",
    background_color: "#5BC8F5",
    theme_color: "#F2B33D",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
