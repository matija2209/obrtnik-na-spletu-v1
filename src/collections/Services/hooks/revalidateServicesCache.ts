import { revalidateTag } from 'next/cache'
import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { TAGS, CACHE_KEY } from '../../../lib/payload/cache-keys'

export const revalidateServicesCache: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation
}) => {
  try {
    // Always revalidate the general services tag
    revalidateTag(TAGS.SERVICES)
    
    // Revalidate specific service cache if it has a slug
    if (doc.slug) {
      const serviceTag = CACHE_KEY.SERVICE_BY_SLUG(doc.slug)
      revalidateTag(serviceTag)
    }
    
    // If slug changed, also revalidate the old slug
    if (operation === 'update' && previousDoc?.slug && previousDoc.slug !== doc.slug) {
      const oldServiceTag = CACHE_KEY.SERVICE_BY_SLUG(previousDoc.slug)
      revalidateTag(oldServiceTag)
    }
    
    console.log(`✅ Revalidated services cache for: ${doc.slug}`)
  } catch (error) {
    console.error('❌ Error revalidating services cache:', error)
  }
}

export const revalidateServicesCacheDelete: CollectionAfterDeleteHook = async ({
  doc
}) => {
  try {
    // Revalidate the general services tag
    revalidateTag(TAGS.SERVICES)
    
    // Revalidate specific service cache if it had a slug
    if (doc.slug) {
      const serviceTag = CACHE_KEY.SERVICE_BY_SLUG(doc.slug)
      revalidateTag(serviceTag)
    }
    
    console.log(`✅ Revalidated services cache after deletion: ${doc.slug}`)
  } catch (error) {
    console.error('❌ Error revalidating services cache after deletion:', error)
  }
} 