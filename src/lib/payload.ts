import { getPayload } from 'payload'
import type { Payload } from 'payload'
import type { 
  Project, 
  Service, 
  Page,
  FormSubmission,
  Form
} from '../../payload-types'

import configPromise from '@payload-config'
import { getImageUrl } from '@/utilities/getImageUrl'
import { draftMode } from 'next/headers'
import { unstable_cacheTag as cacheTag, unstable_cacheLife } from 'next/cache'


// Define a type for the dashboard updates
export type DashboardFormSubmission = {
  id: number;
  formTitle: string; // Title of the related form
  submissionTime: string; // Formatted time of submission
  formId: number; // ID of the form for linking
};

// Initialize Payload instance
export const getPayloadClient = async (): Promise<Payload> => {
  "use cache"
  return getPayload({
    config: configPromise,
  })
}

export const TENANT_ID_BY_SLUG_TAG = (slug: string) => `tenant-id-by-slug-${slug}`;
// Function to get Tenant ID by slug
export const getTenantIdBySlug = async (slug: string): Promise<number | null> => {
  "use cache"
  unstable_cacheLife('max')
  cacheTag(TENANT_ID_BY_SLUG_TAG(slug));
  const payload = await getPayloadClient();
  try {
    const tenantQuery = await payload.find({
      collection: 'tenants',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
      depth: 0, // We only need the ID
    });

    if (tenantQuery.docs.length > 0 && tenantQuery.docs[0].id) {
      return tenantQuery.docs[0].id;
    }
    // console.log(`Tenant not found for slug: ${slug} or ID missing. Query result:`, JSON.stringify(tenantQuery, null, 2));
    return null;
  } catch (error) {
    // console.error(`Error fetching tenant ID for slug ${slug}:`, error);
    return null;
  }
};

export const PROJECTS_TAG = "projects";
// Collection utility functions
export const getProjects = async (query = {}) => {
  "use cache"
  unstable_cacheLife('max')
  cacheTag(PROJECTS_TAG);
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'projects',
    ...query,
  })
}

export const PROJECT_BY_SLUG_TAG = (slug: string) => `project-by-slug-${slug}`;
export const getProject = async (slug: string, query = {}) => {
  "use cache"
  cacheTag(PROJECT_BY_SLUG_TAG(slug));
   unstable_cacheLife('max')
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    ...query,
  })
  return docs[0] as Project | undefined
}

export const SERVICES_TAG = "services";
export const getServices = async (query = {}) => {
  "use cache"
  unstable_cacheLife('max')
  cacheTag(SERVICES_TAG);
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'services',
    ...query,
  })
}

export const SERVICE_BY_SLUG_TAG = (slug: string) => `service-by-slug-${slug}`;
export const getService = async (slug: string, query = {}) => {
  "use cache"
  cacheTag(SERVICE_BY_SLUG_TAG(slug));
   unstable_cacheLife('max')
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug } },
    ...query,
  })
  return docs[0] as Service | undefined
}

export const TESTIMONIALS_TAG = "testimonials";
export const getTestimonials = async (query = {}) => {
  "use cache"
  unstable_cacheLife('max')
  cacheTag(TESTIMONIALS_TAG);
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'testimonials',
    ...query,
  })
}

export const FAQ_ITEMS_TAG = "faq-items";
export const getFaqItems = async (query = {}) => {
  "use cache"
  cacheTag(FAQ_ITEMS_TAG);
  unstable_cacheLife('max')
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'faq-items',
    ...query,
  })
}

export const MACHINERY_TAG = "machinery";
export const getMachinery = async (query = {}) => {
  "use cache"
  cacheTag(MACHINERY_TAG);
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'machinery',
    ...query,
  })
}

export const CTAS_TAG = "ctas";
export const getCtas = async (query = {}) => {
  "use cache"
  unstable_cacheLife('max')
  cacheTag(CTAS_TAG);
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'ctas',
    ...query,
  })
}

export const MEDIA_TAG = "media";
export const getMedia = async (query = {}) => {
  "use cache"
  unstable_cacheLife('max')
  cacheTag(MEDIA_TAG);
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'media',
    ...query,
  })
}

export const BUSINESS_INFO_TAG = "business-info";
// Global utility functions
export const getBusinessInfo = async (query = {}) => {
  "use cache"
  unstable_cacheLife('max')
  cacheTag(BUSINESS_INFO_TAG);
  const payload = await getPayloadClient()
  return payload.findGlobal({
    slug: 'business-info',
    ...query,
  })
}

export const NAVBAR_TAG = "navbar";
export const getNavbar = async (query = {}) => {
  "use cache"
  unstable_cacheLife('max')
  cacheTag(NAVBAR_TAG);
  const payload = await getPayloadClient()
  return payload.findGlobal({
    slug: 'navbar',
    ...query,
  })
}

export const FOOTER_TAG = "footer";
export const getFooter = async (query = {}) => {
  "use cache"
  unstable_cacheLife('max')
  cacheTag(FOOTER_TAG);
  const payload = await getPayloadClient()
  return payload.findGlobal({
    slug: 'footer',
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

export const PAGE_BY_SLUG_TAG = (tenant?: string, slug?: string[]) => {
  const slugStr = slug && slug.length > 0 ? slug.join('-') : 'home'; 
  return `page-${tenant ? tenant + '-' : ''}${slugStr}`;
};
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
  "use cache"
  unstable_cacheLife('max')
  cacheTag(PAGE_BY_SLUG_TAG(tenant, slug));
  // console.log('====== QUERY PAGE BY SLUG - START ======');
  // console.log('Input parameters:', { slug, tenant, overrideAccess, draftParam });
  
  const payload = await getPayload({ config: configPromise })
  const { isEnabled: draft } = draftParam === undefined ? await draftMode() : { isEnabled: draftParam }
  // console.log('Draft mode:', draft);

  // Determine the slug value to search for
  const slugValue = !slug || slug.length === 0 ? 'home' : slug.join('/');
  // console.log('Computed slug value:', slugValue);
  
  try {
    // First, look up the tenant ID from the tenant slug
    // console.log(`Looking up tenant ID for slug: ${tenant}`);
    let tenantId = null;
    
    if (tenant) {
      const tenantQuery = await payload.find({
        collection: 'tenants',
        where: {
          slug: {
            equals: tenant
          }
        },
        limit: 1
      });
      
      if (tenantQuery.docs.length > 0) {
        tenantId = tenantQuery.docs[0].id;
        // console.log(`Found tenant with ID: ${tenantId}`);
      } else {
        // console.log(`No tenant found with slug: ${tenant}`);
      }
    }
    
    // Fetch pages with tenant ID if we found one
    // console.log('Fetching pages...');
    let whereCondition = {};
    
    if (tenantId) {
      whereCondition = {
        tenant: {
          equals: tenantId
        }
      };
      // console.log(`Using where condition:`, JSON.stringify(whereCondition, null, 2));
    }
    
    const pagesQuery = await payload.find({
      collection: 'pages',
      overrideAccess: overrideAccess || draft,
      draft,
      where: whereCondition,
      depth: 2,
      limit: 100,
    });
    
    // console.log(`Found ${pagesQuery.totalDocs} pages for tenant ID: ${tenantId}`);
    // console.log('Page IDs:', pagesQuery.docs.map(doc => doc.id));
    
    if (pagesQuery.docs.length > 0) {
      // Log the structure of all pages
      // pagesQuery.docs.forEach((page, index) => {
        // console.log(`Page ${index + 1} - ID: ${page.id}, Title: ${page.title}, Tenant: ${page.tenant}, Slug: ${page.slug}`);
      // });
      
      // Filter by slug
      // console.log(`Filtering for slug: ${slugValue}`);
      const matchingPages = pagesQuery.docs.filter(page => {
        if (!page.slug) {
          // console.log(`Page ${page.id} has no slug field`);
          return false;
        }
        
        // console.log(`Comparing page slug "${page.slug}" with "${slugValue}"`);
        return page.slug === slugValue;
      });
      
      if (matchingPages.length > 0) {
        // console.log(`Found ${matchingPages.length} matching pages!`);
        return matchingPages[0] as Page;
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
      data: error?.data,
      stack: error?.stack
    });
    return null;
  } finally {
    // console.log('====== QUERY PAGE BY SLUG - END ======');
  }
};

// Function to create a form submission
export const createFormSubmission = async (
  formId: string,
  submissionData: Record<string, any>,
  tenantId: number,
): Promise<FormSubmission> => {
  const payload = await getPayloadClient(); // Get payload instance internally

  // Transform submissionData to the format expected by the form-builder plugin
  const formattedSubmissionData = Object.entries(submissionData).map(
    ([key, value]) => ({
      field: key,
      value: value,
    }),
  );

  // Create a new submission in the 'form-submissions' collection
  const submission = await payload.create({
    collection: 'form-submissions', // Default slug for form submissions by the plugin
    data: {
      form: Number(formId), // Link to the submitted form
      submissionData: formattedSubmissionData, // The actual submitted data
      tenant: tenantId, // Added tenant ID
    },
  });
  return submission as FormSubmission; // Cast to FormSubmission type
};

// Add new function to get the latest form submissions
export const getLatestFormSubmissions = async (limit: number = 5): Promise<DashboardFormSubmission[]> => {
  const payload = await getPayloadClient();
  try {
    const { docs } = await payload.find({
      collection: 'form-submissions',
      limit: limit,
      sort: '-createdAt', // Assuming 'createdAt' field exists and is indexed
      depth: 1, // Fetch related form document
    });
    // Map the results to the new DashboardFormSubmission type
    return docs.map(submission => ({
      id: submission.id,
      formTitle: (submission.form as Form).title, // Access title from the related Form document
      submissionTime: new Date(submission.createdAt).toLocaleString(), // Format time
      formId: (submission.form as Form).id, // Use form ID for link
    }));
  } catch (error) {
    // console.error('Error fetching latest form submissions:', error);
    return [];
  }
};
