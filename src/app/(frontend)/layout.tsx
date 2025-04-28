import type { Metadata } from "next";
import { Oswald, Roboto } from "next/font/google";
import Script from 'next/script';
import "./globals.css";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import { getLocalizedMetadata } from "@/utils/metadata";
import { serviceSchema } from "@/seo/serviceSchema";
import { faqSchema } from "@/seo/faqSchema";
import { aggregateRatingSchema } from "@/seo/aggregateRatingSchema";
import { webSiteSchema } from "@/seo/webSiteSchema";
import { getBusinessInfo, getNavbar, getLogoUrl } from "@/lib/payload";

const oswald = Oswald({
  variable: "--font-heading",
  subsets: ["latin"],
  display: 'swap', // Optional: improves font loading performance
  // Add weights if needed, e.g., weights: ['400', '700']
});

const roboto = Roboto({
  variable: "--font-body",
  subsets: ["latin"],
  display: 'swap', // Optional: improves font loading performance
  weight: ['400', '700'], // Example weights
});

// Generate metadata dynamically based on locale
export async function generateMetadata(): Promise<Metadata> {
  return getLocalizedMetadata("sl");
}

export default async function MyAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const navbarData = await getNavbar()
  // const businessData = await getBusinessInfo()


  // const logoLightUrl = getLogoUrl(businessData, 'light');
  // const logoDarkUrl = getLogoUrl(businessData, 'dark');

  return (
    <html lang="sl" className={`${oswald.variable} ${roboto.variable}`}>
      <head>
        {/* <Script
          id="service-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        {aggregateRatingSchema && (
          <Script
            id="aggregate-rating-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingSchema) }}
          />
        )}
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        /> */}
      </head>
      <body>
        {/* <Navbar 
          navbarData={navbarData} 
          logoLightUrl={logoLightUrl} 
          logoDarkUrl={logoDarkUrl} 
          companyName={businessData.companyName}
          phoneNumber={businessData.phoneNumber}
          email={businessData.email}
          location={businessData.location}
        /> */}
        {children}
        <Footer />
      </body>
    </html>
  );
}
