"use server"
import { getPayload } from 'payload'
import type { Payload } from 'payload'
import type { 
  Project, 
  Service, 
  Page,
  FormSubmission,
  Form,
  ServicePage,
  SubService,

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
  return getPayload({
    config: configPromise,
  })
}

export const TENANT_ID_BY_SLUG_TAG = async (slug: string) => `tenant-id-by-slug-${slug}`;
// Function to get Tenant ID by slug
export const getTenantIdBySlug = async (slug: string): Promise<number | null> => {
  "use cache"
  unstable_cacheLife('max')
  cacheTag(await TENANT_ID_BY_SLUG_TAG(slug));
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

export const PROJECTS_TAG = async () => "projects";
// Collection utility functions
export const getProjects = async (query = {}) => {
  "use cache"
  unstable_cacheLife('max')
  cacheTag(await PROJECTS_TAG());
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'projects',
    ...query,
  })
}

export const PROJECT_BY_SLUG_TAG = async (slug: string) => `project-by-slug-${slug}`;
export const getProject = async (slug: string, query = {}) => {
  "use cache"
  cacheTag(await PROJECT_BY_SLUG_TAG(slug));
   unstable_cacheLife('max')
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    ...query,
  })
  return docs[0] as Project | undefined
}

export const SERVICES_TAG = async () => "services";
export const getServices = async (query = {}) => {
  "use cache"
  unstable_cacheLife('max')
  cacheTag(await SERVICES_TAG());
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'services',
    ...query,
  })
}

export const SERVICE_BY_SLUG_TAG = async (slug: string) => `service-by-slug-${slug}`;
export const getService = async (slug: string, query = {}) => {
  "use cache"
  cacheTag(await SERVICE_BY_SLUG_TAG(slug));
   unstable_cacheLife('max')
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug } },
    ...query,
  })
  return docs[0] as Service | undefined
}

export const TESTIMONIALS_TAG = async () => "testimonials";
export const getTestimonials = async (query = {}) => {
  "use cache"
  unstable_cacheLife('max')
  cacheTag(await TESTIMONIALS_TAG());
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'testimonials',
    ...query,
  })
}

export const FAQ_ITEMS_TAG = async () => "faq-items";
export const getFaqItems = async (query = {}) => {
  "use cache"
  cacheTag(await FAQ_ITEMS_TAG());
  unstable_cacheLife('max')
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'faq-items',
    ...query,
  })
}

export const MACHINERY_TAG = async () => "machinery";
export const getMachinery = async (query = {}) => {
  "use cache"
  cacheTag(await MACHINERY_TAG());
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'machinery',
    ...query,
  })
}

export const CTAS_TAG = async () => "ctas";
export const getCtas = async (query = {}) => {
  "use cache"
  unstable_cacheLife('max')
  cacheTag(await CTAS_TAG());
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'ctas',
    ...query,
  })
}

export const MEDIA_TAG = async () => "media";
export const getMedia = async (query = {}) => {
  "use cache"
  unstable_cacheLife('max')
  cacheTag(await MEDIA_TAG());
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'media',
    ...query,
  })
}

export const BUSINESS_INFO_TAG = async (tenantId: number) => `business-info-${tenantId}`;
// Global utility functions
export const getBusinessInfo = async (tenantId: number) => {
  "use cache"
  unstable_cacheLife('max')
  cacheTag(await BUSINESS_INFO_TAG(tenantId));
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'business-info',
    where: {
      tenant: {
        equals: 2
      }
    },
    limit: 1
  });
  return result.docs.length > 0 ? result.docs[0] : null;
}

export const NAVBAR_TAG = async (tenantId: number) => `navbar-${tenantId}`;

export const getNavbar = async (tenantId:number ) => {
  "use cache"
  unstable_cacheLife('max')
  cacheTag(await NAVBAR_TAG(tenantId));
  const payload = await getPayloadClient()
  if (!tenantId) {
    return null;
  }
  console.log('tenantId', tenantId);
  
  const result = await payload.find({
    collection: 'navbar',
    where: {
      tenant: {
        equals: 2
      }
    },
    limit: 1
  });
  return result.docs.length > 0 ? result.docs[0] : null;
}

export const FOOTER_TAG = async (tenantId: number) => `footer-${tenantId}`;
export const getFooter = async (tenantId: number) => {
  "use cache"
  unstable_cacheLife('max')
  cacheTag(await FOOTER_TAG(tenantId));
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'footer',
    where: {
      tenant: {
        equals: 2
      }
    },
    limit: 1
  });
  return result.docs.length > 0 ? result.docs[0] : null;
}

// Logo utilities
export async function getLogoUrl(businessData?: any, variant: 'light' | 'dark' = 'dark'): Promise<string> {

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

export const PAGE_BY_SLUG_TAG = async (tenant?: string, slug?: string[]) => {
  const slugStr = slug && slug.length > 0 ? slug.join('-') : 'home'; 
  return `page-${tenant ? tenant + '-' : ''}${slugStr}`;
};
// Page utility functions
export const queryPageBySlug = async ({
  slug = ['home'],
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
  cacheTag(await PAGE_BY_SLUG_TAG(tenant, slug));
  // console.log('====== QUERY PAGE BY SLUG - START ======');
  // console.log('Input parameters:', { slug, tenant, overrideAccess, draftParam });
  
  const payload = await getPayload({ config: configPromise })
  const { isEnabled: draft } = draftParam === undefined ? await draftMode() : { isEnabled: draftParam }
  // console.log('Draft mode:', draft);

  // Determine the slug value to search for
  const slugValue = !slug || slug.length === 0 ? 'home' : slug.join('/');
  // console.log('Computed slug value:', slugValue);
  console.log('slugValue', slugValue);
  
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



export const SERVICE_PAGE_BY_SLUG_TAG = async (tenant?: string, slug?: string[]) => {
  const slugStr = slug && slug.length > 0 ? slug.join('-') : 'home'; 
  return `service-page-${tenant ? tenant + '-' : ''}${slugStr}`;
};
// Page utility functions
export const queryServicePageBySlug = async ({
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
  cacheTag(await SERVICE_PAGE_BY_SLUG_TAG(tenant, slug));
  // console.log('====== QUERY PAGE BY SLUG - START ======');
  // console.log('Input parameters:', { slug, tenant, overrideAccess, draftParam });
  
  const payload = await getPayload({ config: configPromise })
  const { isEnabled: draft } = draftParam === undefined ? await draftMode() : { isEnabled: draftParam }
  // console.log('Draft mode:', draft);

  // Determine the slug value to search for
  const slugValue = !slug || slug.length === 0 ? 'home' : slug.join('/');
  // console.log('Computed slug value:', slugValue);
  console.log('slugValue', slugValue);
  
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
      collection: 'service-pages',
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
        return matchingPages[0] as ServicePage;
      } else {
        console.log(`No page found with slug "${slugValue}"`);
      }
    } else {
      console.log('No service pages found for tenant');
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

// ADD FUNCTIONS FOR SUB-SERVICES:

export const SUB_SERVICES_BY_PARENT_TAG = async (parentId: string | number) => `sub-services-by-parent-${parentId}`;
/**
 * Fetches sub-services related to a specific parent service ID.
 */
export const getSubServicesByParent = async (
  parentId: string | number, 
  query: Record<string, any> = {} // Allow additional query params like locale, depth etc.
) => {
  "use cache" // If you are using this in React Server Components
  unstable_cacheLife('max') // Adjust cache lifetime as needed
  cacheTag(await SUB_SERVICES_BY_PARENT_TAG(parentId));

  const payload = await getPayloadClient();
  try {
    const result = await payload.find({
      collection: 'sub_services',
      where: {
        ...query.where, // Spread any existing where clauses from query
        parentService: {
          equals: parentId,
        },
      },
      depth: query.depth !== undefined ? query.depth : 1, // Default depth or from query
      limit: query.limit !== undefined ? query.limit : 0, // Default to all or from query
      sort: query.sort !== undefined ? query.sort : 'title', // Default sort or from query
      locale: query.locale, // Pass locale if provided
      draft: query.draft, // Pass draft status if provided
      overrideAccess: query.overrideAccess, // Pass overrideAccess if provided
    });
    return result.docs as SubService[]; // Ensure correct typing
  } catch (error) {
    console.error(`Error fetching sub-services for parent ID ${parentId}:`, error);
    return [];
  }
};

// Optional: A function to get a single sub-service by its ID if needed
export const SUB_SERVICE_BY_ID_TAG = async (id: string | number) => `sub-service-${id}`;
export const getSubServiceById = async (
  id: string | number, 
  query: Record<string, any> = {}
) => {
  "use cache"
  unstable_cacheLife('max')
  cacheTag(await SUB_SERVICE_BY_ID_TAG(id));

  const payload = await getPayloadClient();
  try {
    const result = await payload.findByID({
      collection: 'sub_services',
      id: id,
      depth: query.depth !== undefined ? query.depth : 1,
      locale: query.locale,
      draft: query.draft,
      overrideAccess: query.overrideAccess,
    });
    return result as SubService | null;
  } catch (error) {
    console.error(`Error fetching sub-service with ID ${id}:`, error);
    return null;
  }
};