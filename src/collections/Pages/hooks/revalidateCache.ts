import { CACHE_KEY,TAGS } from '../../../lib/payload/cache-keys'
import { revalidateTag } from 'next/cache'
import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

// Revalidate cache after page changes
export const revalidatePageCache: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation
}) => {
  try {
    // Always revalidate the general pages tag
    revalidateTag('pages')
    
    // Revalidate specific page cache if it has a slug
    if (doc.slug) {
      const slugArray = doc.slug === 'home' ? [] : [doc.slug]
      const pageTag = CACHE_KEY.PAGE_BY_SLUG(slugArray)
      revalidateTag(pageTag)
    }
    
    // If slug changed, also revalidate the old slug
    if (operation === 'update' && previousDoc?.slug && previousDoc.slug !== doc.slug) {
      const oldSlugArray = previousDoc.slug === 'home' ? [] : [previousDoc.slug]
      const oldPageTag = `page-${oldSlugArray.length > 0 ? oldSlugArray.join('-') : 'home'}`
      revalidateTag(oldPageTag)
    }
    
    console.log(`✅ Revalidated page cache for: ${doc.slug}`)
  } catch (error) {
    console.error('❌ Error revalidating page cache:', error)
  }
}

// Revalidate cache after page deletion
export const revalidatePageCacheDelete: CollectionAfterDeleteHook = async ({
  doc
}) => {
  try {
    // Revalidate general pages tag
    revalidateTag('pages')
    
    // Revalidate specific page cache if it had a slug
    if (doc.slug) {
      const slugArray = doc.slug === 'home' ? [] : [doc.slug]
      const pageTag = `page-${slugArray.length > 0 ? slugArray.join('-') : 'home'}`
      revalidateTag(pageTag)
    }
    
    console.log(`✅ Revalidated page cache after deletion: ${doc.slug}`)
  } catch (error) {
    console.error('❌ Error revalidating page cache after deletion:', error)
  }
} 