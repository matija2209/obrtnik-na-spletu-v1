// --- Image URL Helper --- 

import { Media } from "@payload-types";

// Type representing one of the size objects within Media.sizes
// This extracts the type of `thumbnail`, `card`, or `tablet` if they exist
type MediaSize = NonNullable<Media['sizes']>[keyof NonNullable<Media['sizes']>] | undefined | null;

// Type for the function input: Accepts the full Media object, one of its size objects, or null/undefined
type ImageInput = Media | MediaSize;

/**
 * Retrieves a relative image URL from a Payload Media object or one of its size variants.
 * It prioritizes specified image sizes and converts absolute URLs from the CMS to relative paths.
 *
 * @param image The Media object, a specific size object (e.g., image.sizes.thumbnail), or null/undefined.
 * @param preferredSizeName The preferred image size to use (e.g., 'card', 'tablet'). Defaults to 'card'.
 * @returns A relative image URL string (e.g., "/media/image.jpg"), or undefined if a valid URL cannot be determined.
 */
export function getImageUrl(
  image: ImageInput,
  preferredSizeName: keyof NonNullable<Media['sizes']> = 'card' // Default to 'card'
): string | undefined {
  if (!image || typeof image !== 'object') {
    if (image !== null && image !== undefined) { // Log only if it was explicitly provided but invalid type
        console.warn("getImageUrl: Input is not a valid object:", image);
    }
    return undefined;
  }

  let sourceUrl: string | undefined | null = undefined;

  // Check if 'image' is a full Media object (has 'sizes' property and it's a non-null object)
  if ('sizes' in image && image.sizes && typeof image.sizes === 'object') {
    const mediaObject = image as Media; // Used for fallback to mediaObject.url
    const currentSizes = image.sizes;   // currentSizes is NonNullable<Media['sizes']>

    // Define the order of preference for sizes
    const sizePreferenceOrder: (keyof NonNullable<Media['sizes']>)[] = [
      preferredSizeName,
      'card',       // Fallback 1
      'tablet',     // Fallback 2
      'thumbnail',  // Fallback 3
    ];

    // Attempt to find a URL from the preferred sizes
    for (const sizeKey of sizePreferenceOrder) {
      const specificSize = currentSizes[sizeKey as keyof typeof currentSizes];

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
        return undefined;
      }
    }
  }

  // If no valid sourceUrl was determined or processed, log a warning.
  if (typeof image === 'object' && image !== null) {
     console.warn("getImageUrl: Could not determine a valid and convertible image URL from the input:", image);
  }
  return undefined;
}
