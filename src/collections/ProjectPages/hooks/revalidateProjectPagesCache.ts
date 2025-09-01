import { revalidateTag } from 'next/cache'
import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { TAGS, CACHE_KEY } from '../../../lib/payload/cache-keys'

export const revalidateProjectPagesCache: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation
}) => {
  try {
    // Always revalidate the general project pages tag
    revalidateTag(TAGS.PROJECT_PAGES)
    revalidateTag(TAGS.MENUS)
    revalidateTag(TAGS.FOOTER)
    revalidateTag(TAGS.NAVBAR)
    // Revalidate specific project page cache if it has a slug
    if (doc.slug) {
      const projectPageTag = CACHE_KEY.PROJECT_PAGE_BY_SLUG(doc.slug)
      revalidateTag(projectPageTag)
    }
    
    // If slug changed, also revalidate the old slug
    if (operation === 'update' && previousDoc?.slug && previousDoc.slug !== doc.slug) {
      const oldProjectPageTag = CACHE_KEY.PROJECT_PAGE_BY_SLUG(previousDoc.slug)
      revalidateTag(oldProjectPageTag)
    }
    
    console.log(`✅ Revalidated project page cache for: ${doc.slug}`)
  } catch (error) {
    console.error('❌ Error revalidating project page cache:', error)
  }
}

export const revalidateProjectPagesCacheDelete: CollectionAfterDeleteHook = async ({
  doc
}) => {
  try {
    // Revalidate the general project pages tag
    revalidateTag(TAGS.PROJECT_PAGES)
    
    // Revalidate specific project page cache if it had a slug
    if (doc.slug) {
      const projectPageTag = CACHE_KEY.PROJECT_PAGE_BY_SLUG(doc.slug)
      revalidateTag(projectPageTag)
    }
    
    console.log(`✅ Revalidated project page cache after deletion: ${doc.slug}`)
  } catch (error) {
    console.error('❌ Error revalidating project page cache after deletion:', error)
  }
} 