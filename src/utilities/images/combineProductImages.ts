import { Product, ProductVariant, Media } from '@payload-types'

export interface CombinedImage {
  src: string
  altText: string
  mediaObject?: Media
}

/**
 * Combines images from main product, variants, and gallery in the specified order:
 * 1. Selected variant image (if variant is selected and has image)
 * 2. Main product image
 * 3. Other variant images (if any)
 * 4. Gallery images (if any)
 * 
 * Handles deduplication and type conversion to ensure consistent image format
 */
export function combineProductImages(
  product: Product, 
  variants?: ProductVariant[],
  selectedVariant?: ProductVariant | null
): CombinedImage[] {
  const combinedImages: CombinedImage[] = []
  const seenUrls = new Set<string>()

  // Helper function to safely extract image data
  const processImage = (image: number | Media | null | undefined): CombinedImage | null => {
    if (!image) return null
    
    let mediaObject: Media
    
    // Handle both ID reference and Media object
    if (typeof image === 'number') {
      // For ID references, we can't get the full media object here
      // This would need to be resolved at the component level or with additional data fetching
      return null
    } else {
      mediaObject = image as Media
    }
    
    // Generate image URL - using the same logic as existing components
    const src = mediaObject?.url || ''
    if (!src) return null
    
    // Check for duplicates
    if (seenUrls.has(src)) return null
    seenUrls.add(src)
    
    return {
      src,
      altText: mediaObject?.alt || mediaObject?.filename || 'Product image',
      mediaObject
    }
  }

  // 1. Add selected variant image first (if selected and has image)
  if (selectedVariant && selectedVariant.image) {
    const selectedVariantImage = processImage(selectedVariant.image)
    if (selectedVariantImage) {
      combinedImages.push(selectedVariantImage)
    }
  }

  // 2. Add main product image
  if (product.image) {
    const mainImage = processImage(product.image)
    if (mainImage) {
      combinedImages.push(mainImage)
    }
  }

  // 3. Add other variant images (excluding the selected one)
  if (variants && variants.length > 0) {
    variants.forEach(variant => {
      // Skip the selected variant since we already added it first
      if (selectedVariant && variant.variantSku === selectedVariant.variantSku) {
        return
      }
      
      if (variant.image) {
        const variantImage = processImage(variant.image)
        if (variantImage) {
          combinedImages.push(variantImage)
        }
      }
    })
  }

  // 4. Add gallery images
  if (product.gallery && product.gallery.length > 0) {
    product.gallery.forEach(galleryImage => {
      const processedImage = processImage(galleryImage)
      if (processedImage) {
        combinedImages.push(processedImage)
      }
    })
  }

  return combinedImages
}