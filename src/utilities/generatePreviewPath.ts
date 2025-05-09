import { PayloadRequest, CollectionSlug } from 'payload'
import type { Tenant } from '../../payload-types'

type Props = {
  // collection: keyof typeof collectionPrefixMap // No longer using collectionPrefixMap directly for path construction
  collection: CollectionSlug // Use CollectionSlug for broader compatibility
  slug: string
  req: PayloadRequest
}

export const generatePreviewPath = async ({ collection, slug, req }: Props): Promise<string> => {
  let tenantSlug: string | undefined;
  
  const tenantsForUser = req.user?.tenants
  if (tenantsForUser && tenantsForUser.length > 0) {
    // Check if tenant is an object and has a slug property
    if (typeof tenantsForUser[0].tenant === 'object' && tenantsForUser[0].tenant !== null && 'slug' in tenantsForUser[0].tenant) {
      tenantSlug = (tenantsForUser[0].tenant as Tenant).slug;
    } else {
      // Handle cases where tenant might still be a string ID or unexpected structure
      // Fallback or throw error depending on requirements
      tenantSlug = 'a1-instalacije'; // Keep existing fallback for now
    }
  } else {
    tenantSlug = 'a1-instalacije';
  }

  // Construct the preview path ensuring it starts with a single '/'
  // and uses the slug, which should represent the page's path segment.
  const previewUrlPath = `/${slug.replace(/^\/+/, '')}`;

  const encodedParams = new URLSearchParams({
    slug, // The document's slug
    tenantSlug: tenantSlug, // Use the fetched/determined slug
    collection,
    path: previewUrlPath, // The URL path for preview, e.g., /about-us or /storitve/my-service
    previewSecret: process.env.PREVIEW_SECRET || '',
  })
  
  const url = `/next/preview?${encodedParams.toString()}`

  return url
}