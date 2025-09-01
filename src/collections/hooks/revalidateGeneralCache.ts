import { revalidateTag } from 'next/cache'
import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { TAGS } from '../../lib/payload/cache-keys'

// CTA Hooks
export const revalidateCtasCache: CollectionAfterChangeHook = async ({
  doc,
  operation
}) => {
  try {
    revalidateTag(TAGS.CTAS)
    console.log(`✅ Revalidated CTAs cache for: ${doc.id}`)
  } catch (error) {
    console.error('❌ Error revalidating CTAs cache:', error)
  }
}

export const revalidateCtasCacheDelete: CollectionAfterDeleteHook = async ({
  doc
}) => {
  try {
    revalidateTag(TAGS.CTAS)
    console.log(`✅ Revalidated CTAs cache after deletion: ${doc.id}`)
  } catch (error) {
    console.error('❌ Error revalidating CTAs cache after deletion:', error)
  }
}

// FAQ Items Hooks
export const revalidateFaqItemsCache: CollectionAfterChangeHook = async ({
  doc,
  operation
}) => {
  try {
    revalidateTag(TAGS.FAQ_ITEMS)
    console.log(`✅ Revalidated FAQ items cache for: ${doc.id}`)
  } catch (error) {
    console.error('❌ Error revalidating FAQ items cache:', error)
  }
}

export const revalidateFaqItemsCacheDelete: CollectionAfterDeleteHook = async ({
  doc
}) => {
  try {
    revalidateTag(TAGS.FAQ_ITEMS)
    console.log(`✅ Revalidated FAQ items cache after deletion: ${doc.id}`)
  } catch (error) {
    console.error('❌ Error revalidating FAQ items cache after deletion:', error)
  }
}

// Machinery Hooks
export const revalidateMachineryCache: CollectionAfterChangeHook = async ({
  doc,
  operation
}) => {
  try {
    revalidateTag(TAGS.MACHINERY)
    console.log(`✅ Revalidated machinery cache for: ${doc.id}`)
  } catch (error) {
    console.error('❌ Error revalidating machinery cache:', error)
  }
}

export const revalidateMachineryCacheDelete: CollectionAfterDeleteHook = async ({
  doc
}) => {
  try {
    revalidateTag(TAGS.MACHINERY)
    console.log(`✅ Revalidated machinery cache after deletion: ${doc.id}`)
  } catch (error) {
    console.error('❌ Error revalidating machinery cache after deletion:', error)
  }
}

// Projects Hooks
export const revalidateProjectsCache: CollectionAfterChangeHook = async ({
  doc,
  operation
}) => {
  try {
    revalidateTag(TAGS.PROJECTS)
    console.log(`✅ Revalidated projects cache for: ${doc.id}`)
  } catch (error) {
    console.error('❌ Error revalidating projects cache:', error)
  }
}

export const revalidateProjectsCacheDelete: CollectionAfterDeleteHook = async ({
  doc
}) => {
  try {
    revalidateTag(TAGS.PROJECTS)
    console.log(`✅ Revalidated projects cache after deletion: ${doc.id}`)
  } catch (error) {
    console.error('❌ Error revalidating projects cache after deletion:', error)
  }
}

// Products Hooks
export const revalidateProductsCache: CollectionAfterChangeHook = async ({
  doc,
  operation
}) => {
  try {
    revalidateTag(TAGS.PRODUCTS)
    console.log(`✅ Revalidated products cache for: ${doc.id}`)
  } catch (error) {
    console.error('❌ Error revalidating products cache:', error)
  }
}

export const revalidateProductsCacheDelete: CollectionAfterDeleteHook = async ({
  doc
}) => {
  try {
    revalidateTag(TAGS.PRODUCTS)
    console.log(`✅ Revalidated products cache after deletion: ${doc.id}`)
  } catch (error) {
    console.error('❌ Error revalidating products cache after deletion:', error)
  }
}

// Facebook Pages Hooks
export const revalidateFacebookPagesCache: CollectionAfterChangeHook = async ({
  doc,
  operation
}) => {
  try {
    revalidateTag(TAGS.FACEBOOK_PAGES)
    console.log(`✅ Revalidated Facebook pages cache for: ${doc.id}`)
  } catch (error) {
    console.error('❌ Error revalidating Facebook pages cache:', error)
  }
}

export const revalidateFacebookPagesCacheDelete: CollectionAfterDeleteHook = async ({
  doc
}) => {
  try {
    revalidateTag(TAGS.FACEBOOK_PAGES)
    console.log(`✅ Revalidated Facebook pages cache after deletion: ${doc.id}`)
  } catch (error) {
    console.error('❌ Error revalidating Facebook pages cache after deletion:', error)
  }
} 