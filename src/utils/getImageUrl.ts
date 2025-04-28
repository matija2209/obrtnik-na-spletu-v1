// --- Image URL Helper --- 

import { Media } from "@payload-types";
const PAYLOAD_API_URL = process.env.NEXT_PUBLIC_SERVER_URL

// Type representing one of the size objects within Media.sizes
// This extracts the type of `thumbnail`, `card`, or `tablet` if they exist
type MediaSize = NonNullable<Media['sizes']>[keyof NonNullable<Media['sizes']>] | undefined | null;

// Type for the function input: Accepts the full Media object, one of its size objects, or null/undefined
type ImageInput = Media | MediaSize;

// Helper to get image URL safely for next/image (returns relative path)
export function getImageUrl(image: ImageInput): string | undefined {
  let imagePath: string | undefined = undefined;

  // Ensure image is a valid object and has a url property which is a non-empty string
  if (image && typeof image === 'object' && image.url && typeof image.url === 'string' && image.url.trim() !== '') {
    const urlString = image.url;

    // Check if it's already a relative path
    if (urlString.startsWith('/')) {
      imagePath = urlString;
    } else {
      // Try parsing as a full URL or path relative to the base API URL
      try {
        // Use PAYLOAD_API_URL as base for potentially relative API paths or full URLs
        const parsedUrl = new URL(urlString, PAYLOAD_API_URL);
        imagePath = parsedUrl.pathname;

        // Optional: Path adjustment logic (keep the user's existing commented block)
        // if (!PAYLOAD_API_URL.includes('localhost') && imagePath.startsWith('/api/media/file/')) {
        //    imagePath = imagePath.replace('/api/media/file/', '/media/');
        // }

      } catch (error) {
        console.error(`Error parsing image URL '${urlString}':`, error);
        // If parsing fails, treat as invalid
        imagePath = undefined;
      }
    }
  } else if (typeof image === 'string') {
    // Handle cases where image might be just an ID (string) - likely not usable as a path
     console.warn(`Input is just a string ('${image}'), not an image object with a URL. Cannot determine path.`);
    imagePath = undefined;
  } else {
     // Handle other invalid inputs (null, undefined, object without valid url)
    if (image) { // Only warn if input was provided but invalid
       console.warn("Could not determine image path from input (missing or invalid URL property?):", image);
    }
    imagePath = undefined;
  }

  // console.log('getImageUrl result:', imagePath); // Adjusted debug log

  return imagePath; // Return only the relative path or undefined
}
