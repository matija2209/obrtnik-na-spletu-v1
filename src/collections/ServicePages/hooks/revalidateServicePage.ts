import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { Page, ServicePage } from '@payload-types'
import { revalidatePath, revalidateTag } from 'next/cache'
import { CACHE_KEY,TAGS } from '../../../lib/payload/cache-keys'

export const revalidateServicePage: CollectionAfterChangeHook<ServicePage> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = doc.slug === 'home' ? '/' : `/${doc.slug}`
      revalidatePath(path)
      revalidateTag(CACHE_KEY.SERVICE_PAGE_BY_SLUG(doc.slug as string))
    }

    // If the page was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      revalidatePath(previousDoc?.slug ?? '')
      revalidateTag(CACHE_KEY.SERVICE_PAGE_BY_SLUG(doc.slug as string))
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = async ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = doc?.slug === 'home' ? '/' : `/${doc?.slug}`
    revalidatePath(path)
    revalidateTag(CACHE_KEY.SERVICE_PAGE_BY_SLUG(doc?.slug as string))
  }

  return doc
}