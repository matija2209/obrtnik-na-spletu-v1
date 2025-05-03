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