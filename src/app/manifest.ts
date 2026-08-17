import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "مربی هوشمند تمرین و تغذیه",
    short_name: "Gym Coach",
    description: "تمرین، تغذیه و یادآوری روزانه شخصی سازی شده.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#101413",
    theme_color: "#101413",
    dir: "rtl",
    lang: "fa",
    icons: [
      { src: "/icons/icon.svg", sizes: "any", type: "image/svg+xml" }
    ],
  };
}
