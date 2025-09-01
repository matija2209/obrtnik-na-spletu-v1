import { revalidateTag } from 'next/cache'
import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { TAGS, CACHE_KEY } from '../../../lib/payload/cache-keys'

export const revalidateServicePagesCache: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation
}) => {
  try {
    // Always revalidate the general service pages tag
    revalidateTag(TAGS.SERVICE_PAGES)
    revalidateTag(TAGS.MENUS)
    revalidateTag(TAGS.FOOTER)
    revalidateTag(TAGS.NAVBAR)
    // Revalidate specific service page cache if it has a slug
    if (doc.slug) {
      const servicePageTag = CACHE_KEY.SERVICE_PAGE_BY_SLUG(doc.slug)
      revalidateTag(servicePageTag)
    }
    
    // If slug changed, also revalidate the old slug
    if (operation === 'update' && previousDoc?.slug && previousDoc.slug !== doc.slug) {
      const oldServicePageTag = CACHE_KEY.SERVICE_PAGE_BY_SLUG(previousDoc.slug)
      revalidateTag(oldServicePageTag)
    }
    
    console.log(`✅ Revalidated service page cache for: ${doc.slug}`)
  } catch (error) {
    console.error('❌ Error revalidating service page cache:', error)
  }
}

export const revalidateServicePagesCacheDelete: CollectionAfterDeleteHook = async ({
  doc
}) => {
  try {
    // Revalidate the general service pages tag
    revalidateTag(TAGS.SERVICE_PAGES)
    
    // Revalidate specific service page cache if it had a slug
    if (doc.slug) {
      const servicePageTag = CACHE_KEY.SERVICE_PAGE_BY_SLUG(doc.slug)
      revalidateTag(servicePageTag)
    }
    
    console.log(`✅ Revalidated service page cache after deletion: ${doc.slug}`)
  } catch (error) {
    console.error('❌ Error revalidating service page cache after deletion:', error)
  }
} 