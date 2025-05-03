import { getPayload } from 'payload'
import type { Payload } from 'payload'
import type { 
  Project, 
  Service, 
  Testimonial, 
  FaqItem, 
  Cta, 
  Inquiry, 
  User,
  Media,
  BusinessInfo as BusinessInfoType,
  Navbar as NavbarType,
  Page,
} from '../../payload-types'

import configPromise from '@payload-config'
import { getImageUrl } from '@/utilities/getImageUrl'
import { draftMode } from 'next/headers'
import type { Where } from 'payload'

const PAYLOAD_API_URL = process.env.NEXT_PUBLIC_SERVER_URL

// Initialize Payload instance
export const getPayloadClient = async (): Promise<Payload> => {
  return getPayload({
    config: configPromise,
  })
}

// Collection utility functions
export const getProjects = async (query = {}) => {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'projects',
    ...query,
  })
}

export const getProject = async (slug: string, query = {}) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    ...query,
  })
  return docs[0] as Project | undefined
}

export const getServices = async (query = {}) => {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'services',
    ...query,
  })
}

export const getService = async (slug: string, query = {}) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug } },
    ...query,
  })
  return docs[0] as Service | undefined
}

export const getTestimonials = async (query = {}) => {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'testimonials',
    ...query,
  })
}

export const getFaqItems = async (query = {}) => {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'faq-items',
    ...query,
  })
}

export const getMachinery = async (query = {}) => {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'machinery',
    ...query,
  })
}

export const getCtas = async (query = {}) => {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'ctas',
    ...query,
  })
}

type CreateInquiryData = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  service: number; // ID of the service
  location: string;
  phone?: string;
  status?: 'new' | 'in-progress' | 'completed';
};

export const createInquiry = async (data: CreateInquiryData) => {
  const payload = await getPayloadClient()
  return payload.create({
    collection: 'inquiries',
    data,
  })
}

export const getMedia = async (query = {}) => {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'media',
    ...query,
  })
}

// Global utility functions
export const getBusinessInfo = async (query = {}) => {
  const payload = await getPayloadClient()
  return payload.findGlobal({
    slug: 'business-info',
    ...query,
  })
}

export const getNavbar = async (query = {}) => {
  const payload = await getPayloadClient()
  return payload.findGlobal({
    slug: 'navbar',
    ...query,
  })
}

// Logo utilities
export function getLogoUrl(businessData?: any, variant: 'light' | 'dark' = 'dark'): string {
  if (variant === 'light') {
    // First try to get light logo if available
    if (businessData?.logoLight) {
      const logoUrl = getImageUrl(businessData.logoLight);
      if (logoUrl) return logoUrl;
    }
    // Fall back to dark logo if no light logo is set
    if (businessData?.logo) {
      const logoUrl = getImageUrl(businessData.logo);
      if (logoUrl) return logoUrl;
    }
    // Ultimate fallback for light logo
    return "/logo-dark.png";
  } else {
    // Dark variant
    if (businessData?.logo) {
      const logoUrl = getImageUrl(businessData.logo);
      if (logoUrl) return logoUrl;
    }
    // Fallback for dark logo
    return "/logo.png";
  }
}

// Page utility functions
export const queryPageBySlug = async ({
  slug,
  tenant,
  overrideAccess = false,
  draft: draftParam,
}: {
  slug?: string[]
  tenant?: string
  overrideAccess?: boolean
  draft?: boolean
}) => {
  console.log('====== QUERY PAGE BY SLUG - START ======');
  console.log('Input parameters:', { slug, tenant, overrideAccess, draftParam });
  
  const payload = await getPayload({ config: configPromise })
  const { isEnabled: draft } = draftParam === undefined ? await draftMode() : { isEnabled: draftParam }
  console.log('Draft mode:', draft);

  // Determine the slug value to search for
  const slugValue = !slug || slug.length === 0 ? 'home' : slug.join('/');
  console.log('Computed slug value:', slugValue);
  
  try {
    // Query only by tenant, then filter by slug in memory
    console.log('Querying pages by tenant only, will filter by slug in memory');
    
    // Create the tenant query with correct typing
    let tenantQuery: Where = {};
    
    if (tenant) {
      tenantQuery = {
        'tenant.slug': {
          equals: tenant,
        }
      };
    }
    
    console.log('Tenant query:', JSON.stringify(tenantQuery, null, 2));
    
    // Get all pages for this tenant
    const pagesQuery = await payload.find({
      collection: 'pages',
      overrideAccess: overrideAccess || draft,
      draft,
      where: tenantQuery,
      depth: 2,
      limit: 100, // Increase limit to find the right page
    });
    
    console.log(`Found ${pagesQuery.totalDocs} pages for tenant`);
    
    if (pagesQuery.docs.length > 0) {
      console.log('Available page fields:', Object.keys(pagesQuery.docs[0]));
      
      // Log all pages and their slugs for debugging
      pagesQuery.docs.forEach((page, index) => {
        console.log(`Page ${index + 1} - ID: ${page.id}, Title: ${page.title}, Slug: ${page.slug}`);
      });
      
      // Find the page with matching slug
      const matchingPage = pagesQuery.docs.find(page => {
        if (!page.slug) {
          console.log(`Page ${page.id} has no slug field`);
          return false;
        }
        
        console.log(`Comparing page slug "${page.slug}" with "${slugValue}"`);
        return page.slug === slugValue;
      });
      
      if (matchingPage) {
        console.log('Found matching page!');
        return matchingPage as Page;
      } else {
        console.log(`No page found with slug "${slugValue}"`);
      }
    } else {
      console.log('No pages found for tenant');
    }
    
    return null;
  } catch (error: any) {
    console.error('Error querying pages:', error);
    console.log('Error details:', {
      message: error?.message,
      code: error?.code,
      status: error?.status,
      data: error?.data
    });
    return null;
  } finally {
    console.log('====== QUERY PAGE BY SLUG - END ======');
  }
};
