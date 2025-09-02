
import type { Page, ServicePage, ProjectPage, ProductPage, Post, Media, HeroBlock } from '@payload-types'
import { getImage } from './payload';

// Define supported page types matching our API route
export type OgPageType = 'general' | 'service' | 'project' | 'product' | 'post';

export interface OgImageParams {
  type?: OgPageType;
  title: string;
  subtitle?: string;
  image?: string; // URL or path to image
}

/**
 * Generates a URL for dynamic OG image generation
 * @param params - Configuration for the OG image
 * @returns Complete URL for the OG image endpoint
 */
export function getOgImageUrl({ 
  type = 'general', 
  title, 
  subtitle, 
  image 
}: OgImageParams): string {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
  const endpoint = `${baseUrl}/api/og`;

  const params = new URLSearchParams({
    type: type.toString(),
    title: title.trim(),
  });

  if (subtitle?.trim()) {
    params.append('subtitle', subtitle.trim());
  }

  if (image?.trim()) {
    params.append('image', image.trim());
  }

  return `${endpoint}?${params.toString()}`;
}

/**
 * Utility to truncate text for better OG image display
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Extract image URL from Payload Media object
 */
export function getMediaUrl(media: Media | number | null | undefined): string | undefined {
  if (!media) return undefined;
  if (typeof media === 'number') return undefined;
  return media.url || undefined;
}


/**
 * Generate metadata object with OG image for Next.js generateMetadata
 */
export function generateOgMetadata({ 
  title, 
  description, 
  ogImageParams 
}: {
  title: string;
  description: string;
  ogImageParams: OgImageParams;
}) {
  const ogImageUrl = getOgImageUrl(ogImageParams);
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
      siteName: 'Laneks',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

/**
 * Generate OG image parameters from a Payload page object
 */
export async function getOgParamsFromPage(
  page: Page | ServicePage | ProjectPage | ProductPage | Post
): Promise<OgImageParams> {
  // Determine page type
  let type: OgPageType = 'general';
  if ('pageType' in page) {
    switch (page.pageType) {
      case 'service':
        type = 'service';
        break;
      case 'project':
        type = 'project';
        break;
      case 'product':
        type = 'product';
        break;
      default:
        type = 'general';
    }
  }
  
  // For Posts collection
  if ('publishedAt' in page) {
    type = 'post';
  }

  // Get title
  // const title = truncateText(page.me?.title || 'Laneks', 60);

  // Get subtitle/description
  let title = "In progress"
  let subtitle = 'Working on it';
  // if (page.meta?.description) {
  //   subtitle = truncateText(page.meta.description, 120);
  // } else if ('excerpt' in page && page.excerpt && typeof page.excerpt === 'string') {
  //   subtitle = truncateText(page.excerpt, 120);
  // }

  // Get background image - only from hero blocks, automatically generated
  const image = ""

  return {
    type,
    title,
    subtitle,
    image,
  };
}

/**
 * Helper function specifically for the page slug route metadata generation
 */
export async function generatePageMetadata(
  page: Page | ServicePage | ProjectPage | ProductPage | Post | null
) {
  if (!page) {
    return {
      title: 'Laneks',
      description: 'Profesionalne storitve za vaš dom in podjetje',
    };
  }

  const ogParams = await getOgParamsFromPage(page);

  // Use SEO meta if available, otherwise fallback to page title
  const title = ""//page.meta?.title || page.title || 'Laneks';
  const description = ""//page.meta?.description || 'Profesionalne storitve za vaš dom in podjetje';

  return generateOgMetadata({
    title,
    description,
    ogImageParams: ogParams,
  });
} 