// --- Image URL Helper --- 

import { Media } from "@payload-types";

// Type representing one of the size objects within Media.sizes
// This extracts the type of `thumbnail`, `card`, or `tablet` if they exist
type MediaSize = NonNullable<Media['sizes']>[keyof NonNullable<Media['sizes']>] | undefined | null;

// Type for the function input: Accepts the full Media object, one of its size objects, or null/undefined
type ImageInput = Media | MediaSize;

/**
 * Retrieves the absolute image URL from a Payload Media object or one of its size variants.
 * Assumes that the `url` property stored by Payload is an absolute URL (e.g., from S3).
 *
 * @param image The Media object or a specific size object (e.g., image.sizes.thumbnail).
 * @returns The absolute image URL as a string, or undefined if the input is invalid or lacks a URL.
 */
export function getImageUrl(image: ImageInput): string | undefined {
  // Check if image is a valid object and has a non-empty 'url' property
  if (image && typeof image === 'object' && typeof image.url === 'string' && image.url.trim() !== '') {
    return image.url; // Return the absolute URL directly
  }

  // Log a warning if the input was provided but invalid
  if (image) {
    console.warn("getImageUrl: Input is invalid or missing a valid 'url' property:", image);
  }

  return undefined; // Return undefined for invalid inputs
}
