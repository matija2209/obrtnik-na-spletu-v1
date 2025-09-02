import { revalidateTag } from 'next/cache'
import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { 

  TAGS,
  CACHE_KEY
} from '../../../lib/payload/cache-keys'

// Revalidate cache after media changes
export const revalidateMediaCache: CollectionAfterChangeHook = async ({
  doc,
  operation
}) => {
  try {
revalidateTag(TAGS.HIGH_QUALITY_MEDIA)

    
    // Revalidate specific image cache
    if (doc.id) {
      revalidateTag(CACHE_KEY.IMAGE_BY_ID(doc.id, 'highQualityMedia'))
    }
    
    // If this is from Facebook, might need to revalidate Facebook-related caches
    if (doc.source === 'facebook') {
      // Add any Facebook-specific cache invalidation if needed
      console.log(`✅ Revalidated Facebook media cache for: ${doc.id}`)
    }
    
    console.log(`✅ Revalidated media cache for: ${doc.filename || doc.id}`)
  } catch (error) {
    console.error('❌ Error revalidating media cache:', error)
  }
}

// Revalidate cache after media deletion
export const revalidateMediaCacheDelete: CollectionAfterDeleteHook = async ({
  doc
}) => {
  try {
    // Revalidate general media tags

    revalidateTag(TAGS.HIGH_QUALITY_MEDIA)
    
    // Revalidate specific image cache
    if (doc.id) {

      revalidateTag(CACHE_KEY.IMAGE_BY_ID(doc.id, 'highQualityMedia'))
    }
    
    console.log(`✅ Revalidated media cache after deletion: ${doc.filename || doc.id}`)
  } catch (error) {
    console.error('❌ Error revalidating media cache after deletion:', error)
  }
} 