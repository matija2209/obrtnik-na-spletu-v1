import { Media } from "@payload-types";



// Type guard to check if item is a Media object
const isMediaObject = (item: string | number | Media | null | undefined): item is Media => {
  return typeof item === 'object' && item !== null && 'url' in item;
};

export default isMediaObject

// Utility to get the first media object from hasMany field
export const getFirstMedia = (
  items: (string | number | Media)[] | string | number | Media | null | undefined
): Media | null => {
  if (Array.isArray(items)) {
    const firstItem = items[0];
    return isMediaObject(firstItem) ? firstItem : null;
  }
  return isMediaObject(items) ? items : null;
};

// Utility to get all media objects from hasMany field
export const getAllMedia = (
  items: (string | number | Media)[] | string | number | Media | null | undefined
): Media[] => {
  if (Array.isArray(items)) {
    return items.filter(isMediaObject);
  }
  return isMediaObject(items) ? [items] : [];
};

// Usage examples:
// const firstImage = getFirstMedia(images);
// const allImages = getAllMedia(images);
// const imageUrl = firstImage?.url;