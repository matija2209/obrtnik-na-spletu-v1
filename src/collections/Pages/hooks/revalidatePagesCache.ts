import { revalidateTag } from 'next/cache'
import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { TAGS, CACHE_KEY } from '../../../lib/payload/cache-keys'

export const revalidatePagesCache: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation
}) => {
  try {
    // Always revalidate the general pages tag
    revalidateTag(TAGS.PAGES)
    revalidateTag(TAGS.MENUS)
    revalidateTag(TAGS.FOOTER)
    revalidateTag(TAGS.NAVBAR)
    // Revalidate specific page cache if it has a slug
    if (doc.slug) {
      const slugArray = doc.slug === 'home' ? [] : [doc.slug]
      const pageTag = CACHE_KEY.PAGE_BY_SLUG(slugArray)
      revalidateTag(pageTag)
    }
    
    // If slug changed, also revalidate the old slug
    if (operation === 'update' && previousDoc?.slug && previousDoc.slug !== doc.slug) {
      const oldSlugArray = previousDoc.slug === 'home' ? [] : [previousDoc.slug]
      const oldPageTag = CACHE_KEY.PAGE_BY_SLUG(oldSlugArray)
      revalidateTag(oldPageTag)
    }
    console.log(`✅ Revalidated page cache for: ${doc.slug}`)
  } catch (error) {
    console.error('❌ Error revalidating page cache:', error)
  }
}

export const revalidatePagesCacheDelete: CollectionAfterDeleteHook = async ({
  doc
}) => {
  try {
    // Revalidate the general pages tag
    revalidateTag(TAGS.PAGES)
    
    // Revalidate specific page cache if it had a slug
    if (doc.slug) {
      const slugArray = doc.slug === 'home' ? [] : [doc.slug]
      const pageTag = CACHE_KEY.PAGE_BY_SLUG(slugArray)
      revalidateTag(pageTag)
    }
    
    console.log(`✅ Revalidated page cache after deletion: ${doc.slug}`)
  } catch (error) {
    console.error('❌ Error revalidating page cache after deletion:', error)
  }
} 