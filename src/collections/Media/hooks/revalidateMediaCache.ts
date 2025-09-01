import { revalidateTag } from 'next/cache'
import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { TAGS } from '../../../lib/payload/cache-keys'

export const revalidateMediaCache: CollectionAfterChangeHook = async ({
  doc,
  operation
}) => {
  try {
    // Always revalidate the general media tag
    revalidateTag(TAGS.MEDIA)
    
    console.log(`✅ Revalidated media cache for: ${doc.id}`)
  } catch (error) {
    console.error('❌ Error revalidating media cache:', error)
  }
}

export const revalidateMediaCacheDelete: CollectionAfterDeleteHook = async ({
  doc
}) => {
  try {
    // Revalidate the general media tag
    revalidateTag(TAGS.MEDIA)
    
    console.log(`✅ Revalidated media cache after deletion: ${doc.id}`)
  } catch (error) {
    console.error('❌ Error revalidating media cache after deletion:', error)
  }
} 