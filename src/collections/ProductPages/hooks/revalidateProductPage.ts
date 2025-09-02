import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { Page, ProductPage, ProjectPage } from '@payload-types'
import { revalidatePath, revalidateTag } from 'next/cache'
import { TAGS,CACHE_KEY } from '../../../lib/payload/cache-keys'

export const revalidateProductPage: CollectionAfterChangeHook<ProductPage> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = doc.slug === 'home' ? '/' : `/${doc.slug}`

      payload.logger.info(`Revalidating page at path: ${path}`)

      revalidatePath(path)
      revalidateTag('pages-sitemap')
    }

    // If the page was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      revalidatePath(previousDoc?.slug ?? '')
      revalidateTag(CACHE_KEY.PRODUCT_PAGE_BY_SLUG(doc.slug as string))
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = async ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = doc?.slug === 'home' ? '/' : `/${doc?.slug}`
    revalidatePath(path)
    revalidateTag(CACHE_KEY.PRODUCT_PAGE_BY_SLUG(doc?.slug as string))
  }

  return doc
}