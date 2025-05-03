import { PayloadRequest, CollectionSlug } from 'payload'
import type { Tenant } from '../../payload-types'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  pages: '',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string
  req: PayloadRequest
}

export const generatePreviewPath = async ({ collection, slug, req }: Props): Promise<string> => {
  const user = req.user?.id
  let tenantSlug: string | undefined;
  tenantSlug = 'a1-instalacije';

  const encodedParams = new URLSearchParams({
    slug,
    tenantSlug: tenantSlug, // Use the fetched/determined slug
    collection,
    path: `${collectionPrefixMap[collection]}/${slug}`,
    previewSecret: process.env.PREVIEW_SECRET || '',
  })
  
  const url = `/next/preview?${encodedParams.toString()}`

  return url
}