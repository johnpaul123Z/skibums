import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skijobs.net";

export const viewport = { width: "device-width", initialScale: 1, themeColor: "#0f172a" };

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SkiJobs – Ski Resort Jobs | Vail, Alterra, Boyne Careers",
    template: "%s | SkiJobs",
  },
  description:
    "Find ski resort jobs at 47+ mountains. Browse hundreds of seasonal and year-round positions from Vail Resorts (Epic Pass), Alterra (Ikon Pass), and Boyne Resorts. Ski instructor, lift ops, hospitality & more.",
  keywords: [
    "ski resort jobs",
    "ski instructor jobs",
    "winter jobs",
    "seasonal jobs",
    "Vail jobs",
    "Epic Pass jobs",
    "Ikon Pass jobs",
    "Alterra jobs",
    "Boyne Resorts jobs",
    "mountain jobs",
    "ski patrol jobs",
    "resort hospitality jobs",
  ],
  authors: [{ name: "SkiJobs" }],
  creator: "SkiJobs",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "SkiJobs",
    title: "SkiJobs – Find Ski Resort Jobs at Vail, Alterra & Boyne",
    description:
      "Browse ski resort jobs from 47+ mountains. Seasonal and year-round positions from Vail Resorts, Alterra Mountain Company, and Boyne Resorts.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "SkiJobs – Find ski resort jobs at 47+ mountains" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image"],
    title: "SkiJobs – Ski Resort Jobs | Vail, Alterra, Boyne",
    description: "Find ski resort jobs at 47+ mountains. Browse positions from Vail, Alterra & Boyne Resorts.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "jobs",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon", apple: "/apple-icon" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "SkiJobs",
      url: siteUrl,
      description: "Ski resort job board aggregating careers from Vail Resorts, Alterra Mountain Company, and Boyne Resorts.",
      logo: { "@type": "ImageObject", url: `${siteUrl}/icon` },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "SkiJobs",
      description: "Find ski resort jobs at 47+ mountains. Browse careers from Vail, Alterra, and Boyne Resorts.",
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "en-US",
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "JobPosting",
      "@id": `${siteUrl}/#jobboard`,
      title: "Ski Resort Jobs",
      description: "Seasonal and year-round jobs at ski resorts across North America. Positions include ski instructors, lift operators, ski patrol, hospitality, food & beverage, and retail at Vail, Alterra, and Boyne Resorts.",
      hiringOrganization: { "@id": `${siteUrl}/#organization` },
      jobLocation: {
        "@type": "Place",
        address: { "@type": "PostalAddress", addressCountry: "US" },
      },
      industry: "Ski Resorts",
      employmentType: ["FULL_TIME", "PART_TIME", "SEASONAL", "TEMPORARY"],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
