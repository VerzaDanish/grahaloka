import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Grahaloka | Jasa Arsitek, Kontraktor & Desain Interior Bali",
  description: "Grahaloka — Studio arsitektur 3D, gambar kerja drafter, dan kontraktor konstruksi berpengalaman di Bali & Indonesia. Mewujudkan hunian impian dengan presisi & garansi kualitas.",
  keywords: ["grahaloka", "arsitek bali", "kontraktor bali", "desain interior", "3d rendering", "jasa renovasi rumah", "konstruksi villa"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jakarta.variable} antialiased scroll-smooth`}
    >
      <body className="bg-[#F5F0E8] text-[#22201D] font-sans selection:bg-[#D5C7B3] selection:text-[#171717] min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}

