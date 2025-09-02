// --- Enhanced Image URL Helper with Next.js Optimization --- 

import { HighQualityMedia, Media } from "@payload-types";

// Type representing one of the size objects within Media.sizes
// This extracts the type of `thumbnail`, `card`, or `tablet` if they exist
type MediaSize = NonNullable<Media['sizes']>[keyof NonNullable<Media['sizes']>] | undefined | null;
type HighQualityMediaSize = NonNullable<HighQualityMedia['sizes']>[keyof NonNullable<HighQualityMedia['sizes']>] | undefined | null;
// Type for the function input: Accepts the full Media object, one of its size objects, or null/undefined
export type ImageInput = Media | HighQualityMedia | HighQualityMediaSize | MediaSize | number | null | undefined | (number | Media)[];

/**
 * Retrieves a relative image URL from a Payload Media object or one of its size variants.
 * Enhanced for Next.js Image optimization with better fallback handling.
 *
 * @param image The Media object, a specific size object (e.g., image.sizes.thumbnail), or null/undefined.
 * @param preferredSizeName The preferred image size to use (e.g., 'card', 'tablet'). Defaults to 'card'.
 * @param fallback The fallback image URL to use if no valid image is found. Defaults to '/no-image.svg'.
 * @returns A relative image URL string (e.g., "/media/image.jpg"), or the fallback if a valid URL cannot be determined.
 */
export function getImageUrl(
  image: ImageInput,
  preferredSizeName: keyof NonNullable<Media['sizes']> | keyof NonNullable<HighQualityMedia['sizes']> = "hero-desktop", // Default to 'card'
  fallback: string = '/no-image.svg'
): string  {
  if (!image || typeof image !== 'object' || typeof image === 'number') {
    if (image !== null && image !== undefined) { // Log only if it was explicitly provided but invalid type
        console.warn("getImageUrl: Input is not a valid object:", image);
    }
    return fallback;
  }

  let sourceUrl: string | undefined | null = undefined;

  // Check if 'image' is a full Media object (has 'sizes' property and it's a non-null object)
  if ('sizes' in image && image.sizes && typeof image.sizes === 'object') {
    const mediaObject = image as Media; // Used for fallback to mediaObject.url
    const currentSizes = image.sizes;   // currentSizes is NonNullable<Media['sizes']>

    // Define the order of preference for sizes
    const sizePreferenceOrder: (keyof NonNullable<Media['sizes']> | keyof NonNullable<HighQualityMedia['sizes']>)[] = [
      preferredSizeName,
      'card',       // Fallback 1
      'tablet',     // Fallback 2
      'thumbnail',  // Fallback 3
    ];

    // Attempt to find a URL from the preferred sizes
    for (const sizeKey of sizePreferenceOrder) {
      const specificSize : MediaSize | HighQualityMediaSize = currentSizes[sizeKey as keyof typeof currentSizes] as MediaSize | HighQualityMediaSize;

      if (
        specificSize &&
        typeof specificSize === 'object' &&
        'url' in specificSize &&                // Explicitly check for 'url' property
        typeof specificSize.url === 'string' && // Check if 'url' is a string
        specificSize.url.trim() !== ''          // Check if 'url' is non-empty
      ) {
        sourceUrl = specificSize.url; // TS infers specificSize.url as string here
        break; // Found a preferred size URL
      }
    }

    // If no preferred size URL was found, fallback to the original mediaObject.url
    if (!sourceUrl && typeof mediaObject.url === 'string') {
      sourceUrl = mediaObject.url;
    }
  }
  // Else, 'image' is assumed to be a MediaSize object (like image.sizes.card)
  // or a Media object without a 'sizes' field (relying on its main 'url').
  else if ('url' in image && typeof image.url === 'string') {
    sourceUrl = image.url;
  }

  // Process the sourceUrl if found and it's a non-empty string
  if (sourceUrl && typeof sourceUrl === 'string' && sourceUrl.trim() !== '') {
    try {
      const parsedUrl = new URL(sourceUrl);
      return parsedUrl.pathname;
    } catch (e) {
      if (sourceUrl.startsWith('/')) {
        return sourceUrl; // Already a relative path
      } else {
        console.warn(`getImageUrl: URL "${sourceUrl}" is not an absolute URL and does not start with '/'. Cannot form a relative path.`);
        return fallback;
      }
    }
  }

  // If no valid sourceUrl was determined or processed, log a warning.
  if (typeof image === 'object' && image !== null) {
     console.warn("getImageUrl: Could not determine a valid and convertible image URL from the input:", image);
  }
  console.warn("getImageUrl: Could not determine a valid and convertible image URL from the input");
  return fallback;
}

/**
 * Get image dimensions for Next.js Image component optimization.
 * 
 * @param image The Media object or size object
 * @param preferredSizeName The preferred size to get dimensions for
 * @returns Object with width and height, or null if dimensions cannot be determined
 */
export function getImageDimensions(
  image: ImageInput,
  preferredSizeName: keyof NonNullable<Media['sizes']> | keyof NonNullable<HighQualityMedia['sizes']> = 'card'
): { width: number; height: number } | null {
  if (!image || typeof image !== 'object' || typeof image === 'number') {
    return null;
  }

  if ('sizes' in image && image.sizes && typeof image.sizes === 'object') {
    const currentSizes = image.sizes;
    const specificSize : MediaSize | HighQualityMediaSize = currentSizes[preferredSizeName as keyof typeof currentSizes] as MediaSize | HighQualityMediaSize;

    if (specificSize && typeof specificSize === 'object' && 'width' in specificSize && 'height' in specificSize) {
      const width = specificSize.width;
      const height = specificSize.height;
      
      if (typeof width === 'number' && typeof height === 'number') {
        return { width, height };
      }
    }

    // Fallback to original dimensions from the media object
    if ('width' in image && 'height' in image && 
        typeof image.width === 'number' && typeof image.height === 'number') {
      return {
        width: image.width,
        height: image.height,
      };
    }
  }

  return null;
}

/**
 * Generate srcSet string for responsive images.
 * 
 * @param image The Media object
 * @returns A srcSet string for responsive images
 */
export function getImageSrcSet(image: ImageInput): string {
  if (!image || typeof image !== 'object' || typeof image === 'number') {
    return '';
  }

  if ('sizes' in image && image.sizes && typeof image.sizes === 'object') {
    const srcSetEntries: string[] = [];
    const sizes = image.sizes;

    // Order sizes by width for proper srcSet
    const sizeOrder = ['thumbnail', 'card', 'tablet'] as (keyof NonNullable<Media['sizes']> | keyof NonNullable<HighQualityMedia['sizes']>)[] ;
    
    sizeOrder.forEach(sizeName => {
      const sizeData : MediaSize | HighQualityMediaSize = sizes[sizeName as keyof typeof sizes] as MediaSize | HighQualityMediaSize;
      if (sizeData && typeof sizeData === 'object' && 'url' in sizeData && 'width' in sizeData) {
        const url = sizeData.url;
        const width = sizeData.width;
        
        if (typeof url === 'string' && typeof width === 'number') {
          // Convert absolute URLs to relative paths for srcSet
          try {
            const parsedUrl = new URL(url);
            srcSetEntries.push(`${parsedUrl.pathname} ${width}w`);
          } catch (e) {
            if (url.startsWith('/')) {
              srcSetEntries.push(`${url} ${width}w`);
            }
          }
        }
      }
    });

    return srcSetEntries.join(', ');
  }

  return '';
}
