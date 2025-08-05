import Head from "next/head";
import { useRouter } from "next/router";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  article?: boolean;
  noindex?: boolean;
  canonical?: string;
  structuredData?: object;
}

const defaultSEO = {
  title: "Viking RP - Serveur Minecraft Roleplay Viking Immersif",
  description:
    "Rejoignez Viking RP, le serveur Minecraft roleplay viking le plus immersif. Explorez les terres nordiques, incarnez un guerrier viking et vivez des aventures épiques dans un monde médiéval authentique.",
  keywords:
    "minecraft, roleplay, viking, serveur, RP, médiéval, nordique, aventure, communauté, france",
  image: "/og-image.webp",
  url: "https://viking-rp.fr",
};

export default function SEO({
  title,
  description = defaultSEO.description,
  keywords = defaultSEO.keywords,
  image = defaultSEO.image,
  article = false,
  noindex = false,
  canonical,
  structuredData,
}: SEOProps) {
  const router = useRouter();
  const url = `${defaultSEO.url}${router.asPath}`;
  const fullTitle = title ? `${title} | Viking RP` : defaultSEO.title;
  const fullImage = image.startsWith("http")
    ? image
    : `${defaultSEO.url}${image}`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Viking RP Team" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Canonical URL */}
      <link rel="canonical" href={canonical || url} />

      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
      )}

      {/* Open Graph */}
      <meta property="og:type" content={article ? "article" : "website"} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:alt" content={title || "Viking RP"} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Viking RP" />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:image:alt" content={title || "Viking RP"} />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#1e293b" />
      <meta name="msapplication-TileColor" content="#1e293b" />

      {/* Language */}
      <meta httpEquiv="content-language" content="fr" />

      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* Favicons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/webp" href="/favicon.webp" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
    </Head>
  );
}
