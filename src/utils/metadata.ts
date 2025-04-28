import { Metadata } from "next";

// Define the metadata structure for each language
type LocalizedMetadata = {
  [locale: string]: {
    title: string;
    description: string;
    keywords: string[];
    openGraph: {
      title: string;
      description: string;
      locale: string;
      siteName: string;
    };
    twitter: {
      title: string;
      description: string;
      card: "summary" | "summary_large_image" | "app" | "player";
    };
  };
};

// Define the metadata for each supported language
export const localizedMetadata: LocalizedMetadata = {
  sl: {
    title: "Izkopi, Zemeljska Dela, Ureditev Okolice | TGM PESEK",
    description:
      "TGM PESEK nudi storitve izkopov z mini bagrom, bagerjem goseničarjem in rovokopačem. Izvajamo betonske plošče, podporne zidove, dostavo materialov ter celovito ureditev okolice (tlakovanje, robniki, odvodnjavanje). Zanesljiva ekipa za vaš projekt. Bodrež 31, Grobelno.",
    keywords: [
      "izkop",
      "izkopi",
      "mini bager",
      "bager goseničar",
      "rovokopač",
      "zemeljska dela",
      "gradbena dela",
      "betonska plošča",
      "betonske plošče",
      "podporni zid",
      "podporni zidovi",
      "dostava materiala",
      "ureditev okolice",
      "tlakovanje",
      "polaganje robnikov",
      "izravnava terena",
      "odvodnjavanje",
      "utrjevanje podlage",
      "Silvo Pesek",
      "TGM PESEK",
      "Grobelno",
      "Bodrež",
      "Štajerska",
      "Slovenija",
    ],
    openGraph: {
      title: "Izkopi, Zemeljska Dela, Ureditev Okolice | TGM PESEK",
      description:
        "TGM PESEK nudi storitve izkopov z mini bagrom, bagerjem goseničarjem in rovokopačem. Izvajamo betonske plošče, podporne zidove, dostavo materialov ter celovito ureditev okolice (tlakovanje, robniki, odvodnjavanje). Zanesljiva ekipa za vaš projekt.",
      locale: "sl_SI",
      siteName: "TGM PESEK, Silvo Pesek s.p.",
    },
    twitter: {
      title: "Izkopi, Zemeljska Dela, Ureditev Okolice | TGM PESEK",
      description:
        "TGM PESEK nudi storitve izkopov z mini bagrom, bagerjem goseničarjem in rovokopačem. Izvajamo betonske plošče, podporne zidove, dostavo materialov ter celovito ureditev okolice (tlakovanje, robniki, odvodnjavanje). Zanesljiva ekipa za vaš projekt.",
      card: "summary_large_image",
    },
  },
  // Add other languages here if needed
};

// Helper function to get metadata for a specific locale
export function getLocalizedMetadata(locale: string): Metadata {
  const metadata = localizedMetadata[locale] || localizedMetadata.sl;
  // TODO: Update baseUrl when the actual domain is known
  const baseUrl = "https://tgm-pesek.si"; // Placeholder, update if needed

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    openGraph: {
      title: metadata.openGraph.title,
      description: metadata.openGraph.description,
      locale: metadata.openGraph.locale,
      siteName: metadata.openGraph.siteName,
      type: "website",
      images: [
        {
          // TODO: Update OG image URL when available
          url: `${baseUrl}/open-graph.jpg`, // Placeholder, update when image is ready
          width: 1200,
          height: 630,
          alt: metadata.openGraph.title,
        },
      ],
    },
    twitter: {
      card: metadata.twitter.card,
      title: metadata.twitter.title,
      description: metadata.twitter.description,
      // TODO: Update Twitter image URL when available
      images: [`${baseUrl}/open-graph.jpg`], // Placeholder, update when image is ready
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      // TODO: Add other locales if the site becomes multilingual
      canonical: `${baseUrl}/${locale}`,
      languages: {
         'sl-SI': `${baseUrl}/sl`,
        // 'en-US': `${baseUrl}/en`, // Example for English
      }
      // languages: Object.fromEntries(
      //   Object.keys(localizedMetadata).map((l) => [l, `${baseUrl}/${l}`])
      // ),
    },
  };
}

// Define a helper type to extract the individual image object type, handling both single image and array cases
type OGImageItem = NonNullable<Metadata['openGraph']>['images'] extends (infer U)[] ? U : NonNullable<Metadata['openGraph']>['images'];

// Function to generate page-specific metadata
export function generatePageMetadata(
  locale: string,
  pageTitle?: string,
  pageDescription?: string,
  pagePath?: string // Add path for canonical URL
): Metadata {
  const baseMetadata = getLocalizedMetadata(locale);
   // TODO: Update baseUrl when the actual domain is known
  const baseUrl = "https://tgm-pesek.si"; // Placeholder, update if needed
  const canonicalUrl = pagePath ? `${baseUrl}/${locale}${pagePath === '/' ? '' : pagePath}` : `${baseUrl}/${locale}`;


  // If no page-specific title or description, just update canonical
  if (!pageTitle && !pageDescription) {
     if (baseMetadata.alternates) {
      baseMetadata.alternates.canonical = canonicalUrl;
    }
    return baseMetadata;
  }

  // Deep clone the base metadata to avoid mutations
  const metadata = JSON.parse(JSON.stringify(baseMetadata)) as Metadata;

  // Update with page-specific information if provided
  if (pageTitle) {
    const fullTitle = `${pageTitle} | TGM PESEK`; // Use the new company name
    metadata.title = fullTitle;

    if (metadata.openGraph) {
      metadata.openGraph.title = fullTitle; // Use full title for OG

      // --- Start Refined OG Image Handling ---
      // Revert to using OGImageItem, filter nulls, and assert type on assignment
      let ogImagesArray: Array<Exclude<OGImageItem, string | URL | null | undefined>> = []; // Base type
      const defaultOgImage = {
          url: `${baseUrl}/open-graph.jpg`, // Placeholder
          width: 1200,
          height: 630,
          alt: fullTitle,
      };

      // Check if openGraph and its images property exist
      const currentImages = metadata.openGraph?.images;
      if (currentImages) {
          if (Array.isArray(currentImages)) {
              // Perform map and filter before assigning to ogImagesArray
              const processedImages = currentImages
                  .map(img => {
                      if (typeof img === 'string' || img instanceof URL) {
                          return { url: img.toString(), width: 1200, height: 630, alt: fullTitle };
                      } else if (typeof img === 'object' && img !== null && 'url' in img) {
                          return { ...img, alt: fullTitle };
                      }
                      return null;
                  })
                  .filter(Boolean); // Filter out nulls
              ogImagesArray = processedImages as Array<Exclude<OGImageItem, string | URL | null | undefined>>;
          } else if (typeof currentImages === 'string' || currentImages instanceof URL) {
              ogImagesArray = [{ url: currentImages.toString(), width: 1200, height: 630, alt: fullTitle }];
          } else if (typeof currentImages === 'object' && currentImages !== null && 'url' in currentImages) {
              ogImagesArray = [{ ...currentImages, alt: fullTitle }];
          }
      }

      // If after processing, the array is empty, add the default
      if (ogImagesArray.length === 0) {
           // Ensure defaultOgImage matches the array element type expectations implicitly
          ogImagesArray = [defaultOgImage as Exclude<OGImageItem, string | URL | null | undefined>];
      }

      // Use type assertion on final assignment, ensuring NonNullable for the target type
      metadata.openGraph.images = ogImagesArray as NonNullable<Metadata['openGraph']>['images'];
      // --- End Refined OG Image Handling ---
    }

    if (metadata.twitter) {
      metadata.twitter.title = fullTitle; // Use full title for Twitter
      // Keep placeholder Twitter image URL for now
      // Ensure twitter images is treated correctly (it's usually just a URL string or array of strings)
      if (!metadata.twitter.images) {
           metadata.twitter.images = [`${baseUrl}/open-graph.jpg`]; // Placeholder
      }
      // Note: Twitter image alt text is not directly settable here in the same way as OG
    }
  }

  if (pageDescription) {
    metadata.description = pageDescription;
    if (metadata.openGraph) {
      metadata.openGraph.description = pageDescription;
    }
    if (metadata.twitter) {
      metadata.twitter.description = pageDescription;
    }
  }

   // Update canonical URL in alternates
  if (metadata.alternates) {
    metadata.alternates.canonical = canonicalUrl;
     // Ensure other languages point to their correct paths
     metadata.alternates.languages = {
       'sl-SI': `${baseUrl}/sl${pagePath === '/' ? '' : pagePath || ''}`,
       // 'en-US': `${baseUrl}/en${pagePath === '/' ? '' : pagePath || ''}`, // Example
     };
  }


  return metadata;
}
