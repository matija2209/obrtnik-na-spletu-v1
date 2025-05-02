import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import { Page } from '@payload-types'
// import type { Page } from '../../payload-types' // Trying relative path again


export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc, // The document itself
  previousDoc, // The previous version of the document
  req: { payload, context }, // Original express request
}) => {
  // Check if revalidation is disabled for this request
  if (!context.disableRevalidate) {
    // Revalidate the page path if the document is published
    if (doc._status === 'published') {
      // Determine the path based on the slug (handle 'home' slug specifically)
      const path = doc.slug === 'home' ? '/' : `/${doc.slug}`

      payload.logger.info(`Revalidating page at path: ${path}`)
      revalidatePath(path)
      revalidateTag('pages-sitemap') // Revalidate the sitemap tag
    }

    // If the page was previously published but now is not (e.g., drafted),
    // revalidate the old path to clear the cache for the previously public URL.
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`

      payload.logger.info(`Revalidating old page at path: ${oldPath}`)
      revalidatePath(oldPath)
      revalidateTag('pages-sitemap') // Revalidate the sitemap tag
    }
  }
  return doc // Return the document (though the return value isn't typically used in afterChange)
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({
  doc, // The deleted document
  req: { payload, context }, // Correctly destructure payload here as well
}) => {
  // Check if revalidation is disabled
  if (!context.disableRevalidate) {
    // Determine the path of the deleted page
    const path = doc?.slug === 'home' ? '/' : `/${doc?.slug}`
    payload.logger.info(`Revalidating deleted page path: ${path}`)
    revalidatePath(path) // Revalidate the specific path
    revalidateTag('pages-sitemap') // Revalidate the sitemap tag
  }

  // Return value isn't typically used in afterDelete hooks
  // return doc - this line is often omitted or just returns nothing implicitly
} 