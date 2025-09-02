import { Media } from '@payload-types';

export type ImageUsageContext = 
  | 'thumbnail'    // Small previews, avatars (64px-128px)
  | 'card'         // Product cards, content images (300px-640px)
  | 'hero'         // Large hero images, featured content (1024px+)
  | 'gallery'      // Gallery items (variable, responsive)
  | 'background';  // Background images (full width)

/**
 * Map Payload image sizes to CSS breakpoints and generate appropriate sizes attribute
 */
export function generateSizesAttribute(context: ImageUsageContext, customSizes?: string): string {
  if (customSizes) return customSizes;

  switch (context) {
    case 'thumbnail':
      return '(max-width: 768px) 80px, 100px';
    
    case 'card':
      return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';
    
    case 'hero':
      return '100vw';
    
    case 'gallery':
      return '(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw';
    
    case 'background':
      return '100vw';
    
    default:
      return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';
  }
}

/**
 * Get the best image size for a given context
 */
export function getBestSizeForContext(
  image: Media, 
  context: ImageUsageContext
): { url: string; width: number; height: number } | null {
  if (!image?.sizes) {
    return image?.url ? {
      url: image.url,
      width: image.width || 800,
      height: image.height || 600
    } : null;
  }

  const sizes = image.sizes;

  switch (context) {
    case 'thumbnail':
      return sizes.thumbnail ? {
        url: sizes.thumbnail.url || '',
        width: sizes.thumbnail.width || 300,
        height: sizes.thumbnail.height || 300
      } : null;
    
    case 'card':
    case 'gallery':
      return sizes.card ? {
        url: sizes.card.url || '',
        width: sizes.card.width || 640,
        height: sizes.card.height || 480
      } : null;
    
    case 'hero':
    case 'background':
      return sizes.tablet ? {
        url: sizes.tablet.url || '',
        width: sizes.tablet.width || 1024,
        height: sizes.tablet.height || 768
      } : null;
    
    default:
      // Fallback to card size
      return sizes.card ? {
        url: sizes.card.url || '',
        width: sizes.card.width || 640,
        height: sizes.card.height || 480
      } : null;
  }
}

/**
 * Generate complete srcSet string from all available Payload sizes
 */
export function generateSrcSet(image: Media): string {
  if (!image?.sizes) {
    return image?.url ? `${image.url} ${image.width || 800}w` : '';
  }

  const srcSetEntries: string[] = [];
  const sizes = image.sizes;

  // Add all available sizes in order of width (smallest to largest)
  const sizeOrder = ['thumbnail', 'card', 'tablet'] as const;
  
  sizeOrder.forEach(sizeName => {
    const sizeData = sizes[sizeName];
    if (sizeData?.url && sizeData?.width) {
      // Convert absolute URLs to relative paths
      const url = sizeData.url.replace(/^https?:\/\/[^\/]+/, '');
      srcSetEntries.push(`${url} ${sizeData.width}w`);
    }
  });

  return srcSetEntries.join(', ');
}

/**
 * Get optimized image URL with fallback logic
 */
export function getOptimizedImageUrl(
  image: Media,
  preferredSize: keyof NonNullable<Media['sizes']> = 'card',
  fallback: string = '/no-image.svg'
): string {
  if (!image) return fallback;

  // Try to get the preferred size
  if (image.sizes?.[preferredSize]?.url) {
    return image.sizes[preferredSize]!.url!.replace(/^https?:\/\/[^\/]+/, '');
  }

  // Fallback hierarchy: card -> tablet -> thumbnail -> original
  const fallbackOrder: (keyof NonNullable<Media['sizes']>)[] = ['card', 'tablet', 'thumbnail'];
  
  for (const size of fallbackOrder) {
    if (image.sizes?.[size]?.url) {
      return image.sizes[size]!.url!.replace(/^https?:\/\/[^\/]+/, '');
    }
  }

  // Final fallback to original image
  return image.url?.replace(/^https?:\/\/[^\/]+/, '') || fallback;
}

/**
 * Check if image has required sizes for responsive display
 */
export function hasResponsiveSizes(image: Media): boolean {
  return !!(image?.sizes && (
    image.sizes.thumbnail ||
    image.sizes.card ||
    image.sizes.tablet
  ));
}

/**
 * Get image dimensions for a specific size
 */
export function getImageDimensions(
  image: Media,
  sizeName: keyof NonNullable<Media['sizes']> = 'card'
): { width: number; height: number } | null {
  if (!image) return null;

  // Try to get dimensions from the specified size
  const sizeData = image.sizes?.[sizeName];
  if (sizeData?.width && sizeData?.height) {
    return {
      width: sizeData.width,
      height: sizeData.height
    };
  }

  // Fallback to original dimensions
  if (image.width && image.height) {
    return {
      width: image.width,
      height: image.height
    };
  }

  return null;
}

/**
 * Type guard to check if object is a valid Media object
 */
export function isValidMediaObject(obj: any): obj is Media {
  return obj && 
         typeof obj === 'object' && 
         (obj.url || (obj.sizes && typeof obj.sizes === 'object'));
} 