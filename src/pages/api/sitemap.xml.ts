import { NextApiRequest, NextApiResponse } from "next";

const BASE_URL = "https://viking-rp.fr";

// Define all your pages here
const staticPages = [
  {
    url: "",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    url: "/wiki",
    changefreq: "weekly",
    priority: "0.9",
  },
  {
    url: "/login",
    changefreq: "yearly",
    priority: "0.3",
  },
  {
    url: "/formulaire",
    changefreq: "monthly",
    priority: "0.7",
  },
];

function generateSiteMap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${staticPages
  .map(({ url, changefreq, priority }) => {
    return `
  <url>
    <loc>${BASE_URL}${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join("")}
</urlset>`;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Generate the XML sitemap
  const sitemap = generateSiteMap();

  res.setHeader("Content-Type", "text/xml");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate",
  );

  res.write(sitemap);
  res.end();
}
