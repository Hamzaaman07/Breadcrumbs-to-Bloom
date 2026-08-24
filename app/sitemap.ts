import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://breadcrumbstoblooms.com";
  const routes = ["", "/menu", "/story", "/popups", "/faq", "/contact"];

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/menu" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
