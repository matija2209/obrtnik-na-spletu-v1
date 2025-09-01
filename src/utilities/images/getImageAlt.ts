import { Media } from "@payload-types";
import { ImageInput } from "./getImageUrl";

const getImageAlt = (image: ImageInput, fallback = 'An image'): string => {
    if (!image) return fallback
    if (typeof image === 'number') return fallback;
    if (Array.isArray(image)) return fallback;
    
    // Check if the image object has an alt property
    if (typeof image === 'object' && 'alt' in image && typeof image.alt === 'string') {
        return image.alt || fallback;
    }
    
    return fallback;
}

export default getImageAlt;