import { revalidateTag } from 'next/cache'
import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { 
  TAGS,
  CACHE_KEY
} from '../../../lib/payload/cache-keys'

// Revalidate cache after testimonial changes
export const revalidateTestimonialsCache: CollectionAfterChangeHook = async ({
  doc,
  operation
}) => {
  try {
    // Always revalidate general testimonials tag
    revalidateTag(TAGS.TESTIMONIALS)
    
    // Revalidate specific testimonial cache
    if (doc.id) {
      revalidateTag(CACHE_KEY.TESTIMONIAL_BY_ID(doc.id))
    }
    
    console.log(`✅ Revalidated testimonials cache for: ${doc.name}`)
  } catch (error) {
    console.error('❌ Error revalidating testimonials cache:', error)
  }
}

// Revalidate cache after testimonial deletion
export const revalidateTestimonialsCacheDelete: CollectionAfterDeleteHook = async ({
  doc
}) => {
  try {
    // Revalidate general testimonials tag
    revalidateTag(TAGS.TESTIMONIALS)
    
    // Revalidate specific testimonial cache
    if (doc.id) {
      revalidateTag(CACHE_KEY.TESTIMONIAL_BY_ID(doc.id))
    }
    
    console.log(`✅ Revalidated testimonials cache after deletion: ${doc.name}`)
  } catch (error) {
    console.error('❌ Error revalidating testimonials cache after deletion:', error)
  }
} 