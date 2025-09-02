import { revalidateTag } from 'next/cache'
import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { 
  TAGS,
  CACHE_KEY
} from '../../../lib/payload/cache-keys'

// Revalidate cache after service changes
export const revalidateServicesCache: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation
}) => {
  try {
    // Always revalidate general services tag
    revalidateTag(TAGS.SERVICES)
    
    // Revalidate specific service cache
    if (doc.id) {
      revalidateTag(CACHE_KEY.SERVICE_BY_ID(doc.id))
    }
    
    // Revalidate service page cache if it has a slug
    if (doc.slug) {
      revalidateTag(CACHE_KEY.SERVICE_PAGE_BY_SLUG(doc.slug))
    }
    
    // If slug changed, also revalidate the old slug
    if (operation === 'update' && previousDoc?.slug && previousDoc.slug !== doc.slug) {
      revalidateTag(CACHE_KEY.SERVICE_PAGE_BY_SLUG(previousDoc.slug))
    }
    
    // Revalidate related service pages tag
    revalidateTag('service-pages')
    
    console.log(`✅ Revalidated services cache for: ${doc.title}`)
  } catch (error) {
    console.error('❌ Error revalidating services cache:', error)
  }
}

// Revalidate cache after service deletion
export const revalidateServicesCacheDelete: CollectionAfterDeleteHook = async ({
  doc
}) => {
  try {
    // Revalidate general services tag
    revalidateTag(TAGS.SERVICES)
    
    // Revalidate specific service cache
    if (doc.id) {
      revalidateTag(CACHE_KEY.SERVICE_BY_ID(doc.id))
    }
    
    // Revalidate service page cache if it had a slug
    if (doc.slug) {
      revalidateTag(CACHE_KEY.SERVICE_PAGE_BY_SLUG(doc.slug))
    }
    
    // Revalidate related service pages tag
    revalidateTag('service-pages')
    
    console.log(`✅ Revalidated services cache after deletion: ${doc.title}`)
  } catch (error) {
    console.error('❌ Error revalidating services cache after deletion:', error)
  }
} 