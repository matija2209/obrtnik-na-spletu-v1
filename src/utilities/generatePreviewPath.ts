import { PayloadRequest, CollectionSlug } from 'payload'


type Props = {
  // collection: keyof typeof collectionPrefixMap // No longer using collectionPrefixMap directly for path construction
  collection: CollectionSlug // Use CollectionSlug for broader compatibility
  slug: string
  req: PayloadRequest
}

export const generatePreviewPath = async ({ collection, slug, req }: Props): Promise<string> => {

  // Construct the preview path ensuring it starts with a single '/'
  // and uses the slug, which should represent the page's path segment.
  const previewUrlPath = `/${slug.replace(/^\/+/, '')}`;

  const encodedParams = new URLSearchParams({
    slug, // The document's slug
    collection,
    path: previewUrlPath, // The URL path for preview, e.g., /about-us or /storitve/my-service
    previewSecret: process.env.PREVIEW_SECRET || '',
  })
  
  const url = `/next/preview?${encodedParams.toString()}`

  return url
}