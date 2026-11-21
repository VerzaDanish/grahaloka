import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.grahalokadesign.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/admin/login", "/api/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/admin/login", "/api/"],
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot", "Google-Extended", "Applebot-Extended"],
        allow: ["/", "/llms.txt", "/artikel/"],
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
