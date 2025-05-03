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
  const payload = await getPayload({ config: configPromise })
  const { isEnabled: draft } = draftParam === undefined ? await draftMode() : { isEnabled: draftParam }

  let slugConstraint: Record<string, any> = {}
  
  // Handle homepage (empty slug) and regular pages
  if (!slug || slug.length === 0) {
    slugConstraint = {
      slug: {
        equals: 'home',
      },
    };
  } else {
    slugConstraint = {
      slug: {
        equals: slug.join('/'),
      },
    };
  }

  // Build the where clause
  const whereConditions = [];
  
  if (tenant) {
    whereConditions.push({
      'tenant.slug': {
        equals: tenant,
      },
    });
  }
  
  whereConditions.push(slugConstraint);
  
  try {
    const pageQuery = await payload.find({
      collection: 'pages',
      overrideAccess: overrideAccess || draft,
      draft,
      where: {
        and: whereConditions,
      },
      depth: 2, // Load relationships 2 levels deep
    });

    // Return the first matching page or null if none found
    return pageQuery.docs[0] as Page | null;
  } catch (error) {
    console.error('Error querying page by slug:', error);
    return null;
  }
};
