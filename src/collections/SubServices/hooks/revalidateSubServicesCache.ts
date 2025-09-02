import { revalidateTag } from 'next/cache'
import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { 
  TAGS,
  CACHE_KEY
} from '../../../lib/payload/cache-keys'

// Revalidate cache after sub-service changes
export const revalidateSubServicesCache: CollectionAfterChangeHook = async ({
  doc,
  operation
}) => {
  try {
    // Always revalidate general sub-services tag
    revalidateTag(TAGS.SUB_SERVICES)
    
    // If this sub-service is linked to a parent service, revalidate parent service cache
    if (doc.parentService) {
      revalidateTag(TAGS.SERVICES)
      // Revalidate specific parent service cache
      if (typeof doc.parentService === 'number') {
        revalidateTag(CACHE_KEY.SERVICE_BY_ID(doc.parentService))
      } else if (doc.parentService?.id) {
        revalidateTag(CACHE_KEY.SERVICE_BY_ID(doc.parentService.id))
      }
    }
    
    console.log(`✅ Revalidated sub-services cache for: ${doc.title}`)
  } catch (error) {
    console.error('❌ Error revalidating sub-services cache:', error)
  }
}

// Revalidate cache after sub-service deletion
export const revalidateSubServicesCacheDelete: CollectionAfterDeleteHook = async ({
  doc
}) => {
  try {
    // Revalidate general sub-services tag
    revalidateTag(TAGS.SUB_SERVICES)
    
    // If this sub-service was linked to a parent service, revalidate parent service cache
    if (doc.parentService) {
      revalidateTag(TAGS.SERVICES)
      // Revalidate specific parent service cache
      if (typeof doc.parentService === 'number') {
        revalidateTag(CACHE_KEY.SERVICE_BY_ID(doc.parentService))
      } else if (doc.parentService?.id) {
        revalidateTag(CACHE_KEY.SERVICE_BY_ID(doc.parentService.id))
      }
    }
    
    console.log(`✅ Revalidated sub-services cache after deletion: ${doc.title}`)
  } catch (error) {
    console.error('❌ Error revalidating sub-services cache after deletion:', error)
  }
} 