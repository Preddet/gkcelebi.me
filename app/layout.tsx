import type { Metadata } from "next";
import { dmSans, inter, sourceSerif, lora, fragmentMono } from "@/lib/fonts";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

const SITE_URL = "https://gkcelebi.me";
const SITE_DESCRIPTION =
  "Gökberk Çelebi (gkcelebi) — Bioengineering student at IZTECH in İzmir, Türkiye. Photography, diving, and music.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Gökberk Çelebi",
    template: "%s - Gökberk Çelebi",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Gökberk Çelebi",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon-white.ico", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-black.ico", media: "(prefers-color-scheme: dark)" },
    ],
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Gökberk Çelebi",
    title: "Gökberk Çelebi",
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gökberk Çelebi",
    description: SITE_DESCRIPTION,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Gökberk Çelebi",
  alternateName: ["gkcelebi", "Gokberk Celebi"],
  url: SITE_URL,
  jobTitle: "Bioengineering Student",
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: "Izmir Institute of Technology",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "İzmir",
    addressCountry: "TR",
  },
  sameAs: [
    "https://www.linkedin.com/in/g%C3%B6kberk-%C3%A7elebi/",
    "https://www.instagram.com/gokberk_celebi/",
    "https://www.behance.net/gkberkelebi",
    "https://open.spotify.com/user/utpkb99568j8ads02vigobrhn",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${inter.variable} ${sourceSerif.variable} ${lora.variable} ${fragmentMono.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col md:flex-row">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Sidebar />
        <main className="flex-1 px-8 py-10 md:px-16 md:py-16">{children}</main>
      </body>
    </html>
  );
}
