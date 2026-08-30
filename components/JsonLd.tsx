import React from "react";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://grahaloka.com";

interface JsonLdProps {
  type?: "home" | "article" | "page";
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  datePublished?: string;
  authorName?: string;
}

export default function JsonLd({
  type = "home",
  title,
  description,
  url,
  image,
  datePublished,
  authorName,
}: JsonLdProps) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Grahaloka",
    alternateName: "Grahaloka Architecture & Build",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/artikel?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    name: "Grahaloka Architecture & Build",
    image: image || `${BASE_URL}/logo.png`,
    "@id": `${BASE_URL}/#organization`,
    url: BASE_URL,
    telephone: "+6281234567890",
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Sunset Road No. 88, Seminyak",
      addressLocality: "Badung",
      addressRegion: "Bali",
      postalCode: "80361",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -8.6913,
      longitude: 115.1683,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    sameAs: [
      "https://facebook.com/grahaloka",
      "https://instagram.com/grahaloka",
      "https://linkedin.com/company/grahaloka",
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Beranda",
        item: BASE_URL,
      },
      ...(type === "article"
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: "Artikel",
              item: `${BASE_URL}/artikel`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: title || "Detail Artikel",
              item: url || `${BASE_URL}/artikel`,
            },
          ]
        : type === "page"
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: title || "Halaman",
              item: url || BASE_URL,
            },
          ]
        : []),
    ],
  };

  let articleSchema = null;
  if (type === "article") {
    articleSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url || BASE_URL,
      },
      headline: title,
      image: [image || `${BASE_URL}/logo.png`],
      datePublished: datePublished || new Date().toISOString(),
      dateModified: datePublished || new Date().toISOString(),
      author: {
        "@type": "Person",
        name: authorName || "Tim Grahaloka Studio",
      },
      publisher: {
        "@type": "Organization",
        name: "Grahaloka",
        logo: {
          "@type": "ImageObject",
          url: `${BASE_URL}/logo.png`,
        },
      },
      description: description,
    };
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
    </>
  );
}
