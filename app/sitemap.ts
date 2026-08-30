import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://grahaloka.com";

interface ArticleItem {
  slug: string;
  date?: string;
  published?: boolean;
}

interface PageItem {
  slug: string;
  published?: boolean;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/artikel`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  // Dynamic Blog Articles Sitemap Entries
  try {
    const articlesPath = path.join(process.cwd(), "data", "articles.json");
    if (fs.existsSync(articlesPath)) {
      const articlesData = JSON.parse(fs.readFileSync(articlesPath, "utf8"));
      if (Array.isArray(articlesData)) {
        articlesData
          .filter((art: ArticleItem) => art.published !== false)
          .forEach((art: ArticleItem) => {
            routes.push({
              url: `${BASE_URL}/artikel/${art.slug}`,
              lastModified: art.date ? new Date(art.date) : new Date(),
              changeFrequency: "weekly",
              priority: 0.7,
            });
          });
      }
    }
  } catch (err) {
    console.error("Error generating articles sitemap:", err);
  }

  // Dynamic Custom Pages Sitemap Entries
  try {
    const pagesPath = path.join(process.cwd(), "data", "pages.json");
    if (fs.existsSync(pagesPath)) {
      const pagesData = JSON.parse(fs.readFileSync(pagesPath, "utf8"));
      if (Array.isArray(pagesData)) {
        pagesData
          .filter((pg: PageItem) => pg.published !== false)
          .forEach((pg: PageItem) => {
            routes.push({
              url: `${BASE_URL}/p/${pg.slug}`,
              lastModified: new Date(),
              changeFrequency: "monthly",
              priority: 0.6,
            });
          });
      }
    }
  } catch (err) {
    console.error("Error generating pages sitemap:", err);
  }

  return routes;
}
