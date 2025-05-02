import { PayloadRequest, CollectionSlug } from 'payload'
import type { Page, Tenant } from '../../payload-types'; // Use relative path to root

// Remove collectionPrefixMap as it's not needed for the new structure
// const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
//   pages: '',
// }

type Props = {
  collection: CollectionSlug // Use CollectionSlug directly
  slug: string
  req: PayloadRequest
  data: Partial<Page> // Add data object containing page info
}

export const generatePreviewPath = async ({ collection, slug, req, data }: Props): Promise<string> => {
  const { payload } = req

  // Determine tenant ID - could be string or Tenant object if populated
  const tenantId = typeof data?.tenant === 'object' ? data.tenant?.id : data?.tenant;

  if (!tenantId) {
    console.error('generatePreviewPath: Tenant ID not found on page data.');
    // Return a fallback or error URL if tenant is missing
    return `/error-preview-missing-tenant`;
  }

  try {
    // Fetch the tenant document to get its slug
    const tenant = await payload.findByID({
      collection: 'tenants',
      id: tenantId,
      depth: 0, // No need to populate relationships here
    }) as Tenant; // Cast to Tenant type

    if (!tenant?.slug) {
      console.error(`generatePreviewPath: Tenant slug not found for tenant ID: ${tenantId}`);
      return `/error-preview-tenant-slug-missing`;
    }

    const tenantSlug = tenant.slug;

    // Construct the tenant-specific preview URL
    // We don't need the /next/preview wrapper or secret here,
    // assuming the frontend route handles preview activation.
    const url = `/tenant-slugs/${tenantSlug}/${slug}`

    return url
  } catch (error) {
    console.error('Error fetching tenant in generatePreviewPath:', error);
    return `/error-preview-fetching-tenant`;
  }
}