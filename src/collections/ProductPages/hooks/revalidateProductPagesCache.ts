import { revalidateTag } from 'next/cache'
import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { TAGS, CACHE_KEY } from '../../../lib/payload/cache-keys'

export const revalidateProductPagesCache: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation
}) => {
  try {
    // Always revalidate the general product pages tag
    revalidateTag(TAGS.PRODUCT_PAGES)
    revalidateTag(TAGS.MENUS)
    revalidateTag(TAGS.FOOTER)
    revalidateTag(TAGS.NAVBAR)
    // Revalidate specific product page cache if it has a slug
    if (doc.slug) {
      const productPageTag = CACHE_KEY.PRODUCT_PAGE_BY_SLUG(doc.slug)
      revalidateTag(productPageTag)
    }
    
    // If slug changed, also revalidate the old slug
    if (operation === 'update' && previousDoc?.slug && previousDoc.slug !== doc.slug) {
      const oldProductPageTag = CACHE_KEY.PRODUCT_PAGE_BY_SLUG(previousDoc.slug)
      revalidateTag(oldProductPageTag)
    }
    
    console.log(`✅ Revalidated product page cache for: ${doc.slug}`)
  } catch (error) {
    console.error('❌ Error revalidating product page cache:', error)
  }
}

export const revalidateProductPagesCacheDelete: CollectionAfterDeleteHook = async ({
  doc
}) => {
  try {
    // Revalidate the general product pages tag
    revalidateTag(TAGS.PRODUCT_PAGES)
    
    // Revalidate specific product page cache if it had a slug
    if (doc.slug) {
      const productPageTag = CACHE_KEY.PRODUCT_PAGE_BY_SLUG(doc.slug)
      revalidateTag(productPageTag)
    }
    
    console.log(`✅ Revalidated product page cache after deletion: ${doc.slug}`)
  } catch (error) {
    console.error('❌ Error revalidating product page cache after deletion:', error)
  }
} 