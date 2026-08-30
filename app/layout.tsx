import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/JsonLd";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://grahaloka.com";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Grahaloka | Jasa Arsitek, Kontraktor & Desain Interior Bali",
    template: "%s | Grahaloka Architecture & Build",
  },
  description:
    "Grahaloka — Studio arsitektur 3D, gambar kerja drafter, dan kontraktor konstruksi berpengalaman di Bali & Indonesia. Mewujudkan hunian impian dengan presisi & garansi kualitas.",
  keywords: [
    "grahaloka",
    "arsitek bali",
    "kontraktor bali",
    "desain interior bali",
    "3d rendering villa",
    "jasa renovasi rumah bali",
    "konstruksi villa mewah",
    "boq bangunan",
  ],
  authors: [{ name: "Grahaloka Architecture & Build Studio" }],
  creator: "Grahaloka Studio",
  publisher: "Grahaloka Studio",
  alternates: {
    canonical: BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Grahaloka | Jasa Arsitek, Kontraktor & Desain Interior Bali",
    description:
      "Studio arsitektur 3D photorealistic, gambar kerja CAD/BIM, dan kontraktor sipil terpercaya di Bali. Garansi presisi struktur & garansi biaya fixed-price.",
    url: BASE_URL,
    siteName: "Grahaloka Studio",
    images: [
      {
        url: `${BASE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: "Grahaloka Architecture & Build Studio Bali",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grahaloka | Jasa Arsitek, Kontraktor & Desain Interior Bali",
    description:
      "Studio arsitektur 3D photorealistic, gambar kerja CAD/BIM, dan kontraktor sipil terpercaya di Bali.",
    images: [`${BASE_URL}/logo.png`],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${cormorant.variable} ${jakarta.variable} antialiased scroll-smooth`}
    >
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body
        suppressHydrationWarning
        className="bg-[#F5F0E8] text-[#22201D] font-sans selection:bg-[#D5C7B3] selection:text-[#171717] min-h-screen flex flex-col"
      >
        <JsonLd type="home" />
        {children}
      </body>
    </html>
  );
}
