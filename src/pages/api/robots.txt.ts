import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /login

# Sitemap
Sitemap: https://viking-rp.fr/api/sitemap.xml

# Crawl delay (optional)
Crawl-delay: 1`;

  res.setHeader("Content-Type", "text/plain");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate",
  );

  res.status(200).send(robotsTxt);
}

