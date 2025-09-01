import { revalidateTag } from 'next/cache'
import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { TAGS } from '../../../lib/payload/cache-keys'

export const revalidateTestimonialsCache: CollectionAfterChangeHook = async ({
  doc,
  operation
}) => {
  try {
    // Always revalidate the general testimonials tag
    revalidateTag(TAGS.TESTIMONIALS)
    
    console.log(`✅ Revalidated testimonials cache for: ${doc.id}`)
  } catch (error) {
    console.error('❌ Error revalidating testimonials cache:', error)
  }
}

export const revalidateTestimonialsCacheDelete: CollectionAfterDeleteHook = async ({
  doc
}) => {
  try {
    // Revalidate the general testimonials tag
    revalidateTag(TAGS.TESTIMONIALS)
    
    console.log(`✅ Revalidated testimonials cache after deletion: ${doc.id}`)
  } catch (error) {
    console.error('❌ Error revalidating testimonials cache after deletion:', error)
  }
} 