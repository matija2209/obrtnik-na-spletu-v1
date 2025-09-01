"use server"
import { getPayload } from 'payload'
import type { PaginatedDocs, Payload } from 'payload'
import type { 
  Service, 
  Page,
  FormSubmission,
  Form,
  ServicePage,
  Project,
  ProjectPage,
  ProductPage,
  Media,
  Product,
  ProductVariant,
  SubService
} from '@payload-types'

import configPromise from '@payload-config'
import { getImageUrl } from '@/utilities/images/getImageUrl'
import { draftMode } from 'next/headers'
import { unstable_cache, unstable_cacheLife } from 'next/cache'
import { TAGS, CACHE_KEY } from './cache-keys'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'

// Define a type for the dashboard updates
export type DashboardFormSubmission = {
  id: number;
  formTitle: string; // Title of the related form
  submissionTime: string; // Formatted time of submission
  formId: number; // ID of the form for linking
};

// Cache tag functions for tenant-specific caching
export const TENANT_ID_BY_SLUG_TAG = async (slug: string) => `tenant-id-by-slug-${slug}`;
export const BUSINESS_INFO_TAG = async (tenantId: number) => `business-info-${tenantId}`;
export const FOOTER_TAG = async (tenantId: number) => `footer-${tenantId}`;
export const NAVBAR_TAG = async (tenantId: number) => `navbar-${tenantId}`;

// Initialize Payload instance
export const getPayloadClient = async (): Promise<Payload> => {
  return getPayload({
    config: configPromise,
  })
}

// Tenant-specific function with enhanced caching
export const getTenantIdBySlug = async (slug: string): Promise<number | null> => {
  return await unstable_cache(
    async () => {
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
        return null;
      } catch (error) {
        return null;
      }
    },
    [`tenant-id-by-slug-${slug}`],
    {
      tags: ['tenants'],
      revalidate: false
    }
  )();
};

// Static Paths Generation
export const getStaticPaths = async (): Promise<{ slug: string[] }[]> => {
  return await unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const staticPaths: { slug: string[] }[] = []
      
      try {
        // Get all regular pages
        const pages = await payload.find({
          collection: 'pages',
          limit: 1000,
          where: {
            _status: { equals: 'published' }
          }
        })
        
        // Get all service pages
        const servicePages = await payload.find({
          collection: 'service-pages',
          limit: 1000,
          where: {
            _status: { equals: 'published' }
          }
        })
        
        // Get all project pages
        const projectPages = await payload.find({
          collection: 'project-pages',
          limit: 1000,
          where: {
            _status: { equals: 'published' }
          }
        })
        
        // Get all product pages
        const productPages = await payload.find({
          collection: 'product-pages',
          limit: 1000,
          where: {
            _status: { equals: 'published' }
          }
        })
        
        // Add regular pages
        pages.docs.forEach((page) => {
          if (page.slug && typeof page.slug === 'string') {
            staticPaths.push({ slug: page.slug === 'home' ? [] : [page.slug] })
          }
        })
        
        // Add service pages with different language prefixes
        const serviceLanguages = ['storitve', 'tretmaji']
        servicePages.docs.forEach((page) => {
          if (page.slug && typeof page.slug === 'string') {
            serviceLanguages.forEach(lang => {
              staticPaths.push({ slug: [lang, page.slug as string] })
            })
          }
        })
        
        // Add project pages with different language prefixes
        const projectLanguages = ['projekti']
        projectPages.docs.forEach((page) => {
          if (page.slug && typeof page.slug === 'string') {
            projectLanguages.forEach(lang => {
              staticPaths.push({ slug: [lang, page.slug as string] })
            })
          }
        })
        
        // Add product pages with different language prefixes
        const productLanguages = ['izdelki']
        productPages.docs.forEach((page) => {
          if (page.slug && typeof page.slug === 'string') {
            productLanguages.forEach(lang => {
              staticPaths.push({ slug: [lang, page.slug as string] })
            })
          }
        })
        
        return staticPaths
        
      } catch (error) {
        console.error('Error generating static params:', error)
        return []
      }
    },
    [CACHE_KEY.STATIC_PATHS()],
    {
      tags: [TAGS.PAGES, TAGS.SERVICE_PAGES, TAGS.PROJECT_PAGES, TAGS.PRODUCT_PAGES],
      revalidate: false
    }
  )();
}

// Services
export const getServices = async (query = {}) => {
  return await unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      return payload.find({
        collection: 'services',
        ...query,
      })
    },
    [CACHE_KEY.SERVICES()],
    {
      tags: [TAGS.SERVICES],
      revalidate: false
    }
  )();
}

export const getService = async (slug: string, query = {}) => {
  return await unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const { docs } = await payload.find({
        collection: 'services',
        where: { slug: { equals: slug } },
        ...query,
      })
      return docs[0] as Service | undefined
    },
    [CACHE_KEY.SERVICE_BY_SLUG(slug)],
    {
      tags: [TAGS.SERVICES],
      revalidate: false
    }
  )();
}

export const getServiceById = async (serviceId: number) => {
  return await unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.findByID({
        collection: 'services',
        id: serviceId,
      })
      return result
    },
    [CACHE_KEY.SERVICE_BY_ID(serviceId)],
    {
      tags: [TAGS.SERVICES],
      revalidate: false
    }
  )();
}

export const getMediaImages = async (images: number[]): Promise<PaginatedDocs<Media>> => {
  return await unstable_cache(
    async (): Promise<PaginatedDocs<Media>> => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: "media",
        where: { id: { in: images } },
      })
      return result
    },
    [CACHE_KEY.MEDIA_IMAGES(images)],
    {
      tags: [TAGS.MEDIA],
      revalidate: false
    }
  )();
}

export const getServicesByIds = async (serviceIds: number[]) => {
  if (serviceIds.length === 0) return [];
  
  return await unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const services = await payload.find({
        collection: 'services',
        where: { id: { in: serviceIds } },
      })
      return services.docs
    },
    [CACHE_KEY.SERVICES_BY_IDS(serviceIds)],
    {
      tags: [TAGS.SERVICES],
      revalidate: false
    }
  )();
}

// Sub-Services
export const getSubServiceById = async (subServiceId: number) => {
  return await unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.findByID({
        collection: 'sub_services',
        id: subServiceId,
      })
      return result
    },
    [CACHE_KEY.SUB_SERVICE_BY_ID(subServiceId)],
    {
      tags: [TAGS.SUB_SERVICES],
      revalidate: false
    }
  )();
}

export const getSubServicesByIds = async (subServiceIds: number[]) => {
  if (subServiceIds.length === 0) return [];
  
  return await unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const subServices = await payload.find({
        collection: 'sub_services',
        where: { id: { in: subServiceIds } },
      })
      return subServices.docs
    },
    [CACHE_KEY.SUB_SERVICES_BY_IDS(subServiceIds)],
    {
      tags: [TAGS.SUB_SERVICES],
      revalidate: false
    }
  )();
}

// Enhanced sub-services function from payload.ts
export const getSubServicesByParent = async (
  parentId: string | number, 
  query: Record<string, any> = {}
) => {
  return await unstable_cache(
    async () => {
      const payload = await getPayloadClient();
      try {
        const result = await payload.find({
          collection: 'sub_services',
          where: {
            ...query.where,
            parentService: {
              equals: parentId,
            },
          },
          depth: query.depth !== undefined ? query.depth : 1,
          limit: query.limit !== undefined ? query.limit : 0,
          sort: query.sort !== undefined ? query.sort : 'title',
          locale: query.locale,
          draft: query.draft,
          overrideAccess: query.overrideAccess,
        });
        return result.docs as SubService[];
      } catch (error) {
        console.error(`Error fetching sub-services for parent ID ${parentId}:`, error);
        return [];
      }
    },
    [`sub-services-by-parent-${parentId}`],
    {
      tags: [TAGS.SUB_SERVICES],
      revalidate: false
    }
  )();
};

// Testimonials
export const getTestimonials = async (query = {}) => {
  return await unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      return payload.find({
        collection: 'testimonials',
        ...query,
      })
    },
    [CACHE_KEY.TESTIMONIALS()],
    {
      tags: [TAGS.TESTIMONIALS],
      revalidate: false
    }
  )();
}

export const getTestimonial = async (testimonialId: number) => {
  return await unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.findByID({
        collection: 'testimonials',
        id: testimonialId,
      })
      return result
    },
    [CACHE_KEY.TESTIMONIAL_BY_ID(testimonialId)],
    {
      tags: [TAGS.TESTIMONIALS],
      revalidate: false
    }
  )();
}

export const getTestimonialsByIds = async (testimonialIds: number[]) => {
  if (testimonialIds.length === 0) return [];
  
  return await unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const testimonials = await payload.find({
        collection: 'testimonials',
        where: { id: { in: testimonialIds } },
      })
      return testimonials.docs
    },
    [CACHE_KEY.TESTIMONIALS_BY_IDS(testimonialIds)],
    {
      tags: [TAGS.TESTIMONIALS],
      revalidate: false
    }
  )();
}

// FAQ Items
export const getFaqItems = async (query = {}) => {
  return await unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      return payload.find({
        collection: 'faq-items',
        ...query,
      })
    },
    [CACHE_KEY.FAQ_ITEMS()],
    {
      tags: [TAGS.FAQ_ITEMS],
      revalidate: false
    }
  )();
}

// CTAs
export const getCtas = async (query = {}) => {
  return await unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      return payload.find({
        collection: 'ctas',
        ...query,
      })
    },
    [CACHE_KEY.CTAS()],
    {
      tags: [TAGS.CTAS],
      revalidate: false
    }
  )();
}

export const getCta = async (ctaId: number) => {
  return await unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.findByID({
        collection: 'ctas',
        id: ctaId,
      })
      return result
    },
    [CACHE_KEY.CTA_BY_ID(ctaId)],
    {
      tags: [TAGS.CTAS],
      revalidate: false
    }
  )();
}

export const getCtasByIds = async (ctaIds: number[]) => {
  if (ctaIds.length === 0) return [];
  
  return await unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const ctas = await payload.find({
        collection: 'ctas',
        where: { id: { in: ctaIds } },
      })
      return ctas.docs
    },
    [CACHE_KEY.CTAS_BY_IDS(ctaIds)],
    {
      tags: [TAGS.CTAS],
      revalidate: false
    }
  )();
}

// FAQ Items
export const getFaqItem = async (faqItemId: number) => {
  return await unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.findByID({
        collection: 'faq-items',
        id: faqItemId,
      })
      return result
    },
    [CACHE_KEY.FAQ_ITEM_BY_ID(faqItemId)],
    {
      tags: [TAGS.FAQ_ITEMS],
      revalidate: false
    }
  )();
}

export const getFaqItemsByIds = async (faqItemIds: number[]) => {
  if (faqItemIds.length === 0) return [];
  
  return await unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const faqItems = await payload.find({
        collection: 'faq-items',
        where: { id: { in: faqItemIds } },
      })
      return faqItems.docs
    },
    [CACHE_KEY.FAQ_ITEMS_BY_IDS(faqItemIds)],
    {
      tags: [TAGS.FAQ_ITEMS],
      revalidate: false
    }
  )();
}

// Forms
export const getForm = async (formId: number) => {
  return await unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.findByID({
        collection: "forms",
        id: formId,
      })
      return result
    },
    [CACHE_KEY.FORM_BY_ID(formId)],
    {
      tags: [TAGS.FORMS],
      revalidate: false
    }
  )();
}

// Media  
export const getMedia = async (query = {}) => {
  return await unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      return payload.find({
        collection: 'media',
        ...query,
      })
    },
    [CACHE_KEY.MEDIA()],
    {
      tags: [TAGS.MEDIA],
      revalidate: false
    }
  )();
}

export const getImage = async (imageId: number, collection: "media" = "media") => {
  return await unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.findByID({
        collection,
        id: imageId,
      })
      return result
    },
    [CACHE_KEY.IMAGE_BY_ID(imageId, collection)],
    {
      tags: [TAGS.MEDIA],
      revalidate: false
    }
  )();
}

// Global utility functions
export const getBusinessInfo = async (tenantId: number) => {
  return await unstable_cache(
    async () => {
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
    },
    [`business-info-${tenantId}`],
    {
      tags: [TAGS.BUSINESS_INFO],
      revalidate: false
    }
  )();
}

export const getNavbar = async (tenantId:number ) => {
  return await unstable_cache(
    async () => {
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
    },
    [`navbar-${tenantId}`],
    {
      tags: [TAGS.NAVBAR],
      revalidate: false
    }
  )();
}

export const getFooter = async (tenantId: number) => {
  return await unstable_cache(
    async () => {
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
    },
    [`footer-${tenantId}`],
    {
      tags: [TAGS.FOOTER],
      revalidate: false
    }
  )();
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

export const queryPageBySlug = async ({
  slug = ['home'],
  tenantId,
  overrideAccess = false,
  draft: draftParam,
}: {
  slug?: string[]
  tenantId?: number | null
  overrideAccess?: boolean
  draft?: boolean
}) => {
  // Don't cache draft pages
  if (draftParam || overrideAccess) {
    const payload = await getPayload({ config: configPromise })
    const { isEnabled: draft } = draftParam === undefined ? await draftMode() : { isEnabled: draftParam }
    
    const slugValue = !slug || slug.length === 0 ? 'home' : slug.join('/');
    console.log('slugValue', slugValue);
    
    try {
      let whereCondition = {};
      
      if (tenantId) {
        whereCondition = {
          tenant: {
            equals: tenantId
          }
        };
      }
      
      const pagesQuery = await payload.find({
        collection: 'pages',
        overrideAccess: overrideAccess || draft,
        draft,
        where: whereCondition,
        depth: 0,
        limit: 100,
      });
      
      if (pagesQuery.docs.length > 0) {
        const matchingPages = pagesQuery.docs.filter(page => {
          if (!page.slug) {
            return false;
          }
          return page.slug === slugValue;
        });
        
        if (matchingPages.length > 0) {
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
    }
  }

  // Cache non-draft pages
  return await unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      const slugValue = !slug || slug.length === 0 ? 'home' : slug.join('/');
      console.log('slugValue', slugValue);
      
      try {
        let whereCondition = {};
        
        if (tenantId) {
          whereCondition = {
            tenant: {
              equals: tenantId
            }
          };
        }
        
        const pagesQuery = await payload.find({
          collection: 'pages',
          overrideAccess: false,
          draft: false,
          where: whereCondition,
          depth: 0,
          limit: 100,
        });
        
        if (pagesQuery.docs.length > 0) {
          const matchingPages = pagesQuery.docs.filter(page => {
            if (!page.slug) {
              return false;
            }
            return page.slug === slugValue;
          });
          
          if (matchingPages.length > 0) {
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
        return null;
      }
    },
    [CACHE_KEY.PAGE_BY_SLUG(slug)],
    {
      tags: [TAGS.PAGES],
      revalidate: false
    }
  )();
};

// Form functions - Enhanced with tenantId from payload.ts
export const createFormSubmission = async (
  formId: string,
  submissionData: Record<string, any>,
  tenantId?: number,
): Promise<FormSubmission> => {
  const payload = await getPayloadClient()
  
  // Transform submissionData to the format expected by the form-builder plugin
  const formattedSubmissionData = Object.entries(submissionData).map(
    ([key, value]) => ({
      field: key,
      value: String(value),
    }),
  );
  
  const data: any = {
    form: Number(formId),
    submissionData: formattedSubmissionData,
  };
  
  if (tenantId) {
    data.tenant = tenantId;
  }
  
  return payload.create({
    collection: 'form-submissions',
    data,
  }) as Promise<FormSubmission>
}

export const getLatestFormSubmissions = async (limit: number = 5): Promise<DashboardFormSubmission[]> => {
  return await unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const submissions = await payload.find({
        collection: 'form-submissions',
        limit,
        sort: '-createdAt',
        depth: 1,
      });

      return submissions.docs.map((submission: any) => ({
        id: submission.id,
        formTitle: typeof submission.form === 'object' ? submission.form.title || 'Unknown Form' : 'Unknown Form',
        submissionTime: new Date(submission.createdAt).toLocaleString(),
        formId: typeof submission.form === 'object' ? submission.form.id : submission.form,
      }));
    },
    [CACHE_KEY.FORM_SUBMISSIONS(limit)],
    {
      tags: ['form-submissions'],
      revalidate: false
    }
  )();
}

// Service Pages
export const queryServicePageBySlug = async ({
  slug,
  tenantId,
  overrideAccess = false,
  draft: draftParam,
}: {
  slug?: string
  tenantId?: number | null
  overrideAccess?: boolean
  draft?: boolean
}) => {
  // Don't cache draft pages
  if (draftParam || overrideAccess) {
    const payload = await getPayload({ config: configPromise })
    const { isEnabled: draft } = draftParam === undefined ? await draftMode() : { isEnabled: draftParam }

    try {
      let whereCondition: any = {
        slug: {
          equals: slug
        }
      };
      
      if (tenantId) {
        whereCondition.tenant = {
          equals: tenantId
        };
      }
      
      const pagesQuery = await payload.find({
        collection: 'service-pages',
        overrideAccess: overrideAccess || draft,
        draft,
        where: whereCondition,
        depth: 0,
        limit: 100,
      });
      
      if (pagesQuery.docs.length > 0) {
        const matchingPages = pagesQuery.docs.filter(page => {
          if (!page.slug) {
            return false;
          }
          return page.slug === slug;
        });
        
        if (matchingPages.length > 0) {
          return matchingPages[0] as ServicePage;
        } else {
          console.log(`No page found with slug "${slug}"`);
        }
      } else {
        console.log('No service pages found for tenant');
      }
      
      return null;
    } catch (error: any) {
      console.error('Error querying pages:', error);
      return null;
    }
  }

  // Cache non-draft pages
  return await unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })

      try {
        let whereCondition: any = {
          slug: {
            equals: slug
          }
        };
        
        if (tenantId) {
          whereCondition.tenant = {
            equals: tenantId
          };
        }
        
        const pagesQuery = await payload.find({
          collection: 'service-pages',
          overrideAccess: false,
          draft: false,
          where: whereCondition,
          depth: 0,
          limit: 100,
        });
        
        if (pagesQuery.docs.length > 0) {
          const matchingPages = pagesQuery.docs.filter(page => {
            if (!page.slug) {
              return false;
            }
            return page.slug === slug;
          });
          
          if (matchingPages.length > 0) {
            return matchingPages[0] as ServicePage;
          } else {
            console.log(`No page found with slug "${slug}"`);
          }
        } else {
          console.log('No service pages found for tenant');
        }
        
        return null;
      } catch (error: any) {
        console.error('Error querying pages:', error);
        return null;
      }
    },
    [CACHE_KEY.SERVICE_PAGE_BY_SLUG(slug || '')],
    {
      tags: [TAGS.SERVICE_PAGES],
      revalidate: false
    }
  )();
};

export const queryProjectPageBySlug = async ({
  slug,
  tenantId,
  overrideAccess = false,
  draft: draftParam,
}: {
  slug?: string
  tenantId?: number | null
  overrideAccess?: boolean
  draft?: boolean
}) => {
  // Don't cache draft pages
  if (draftParam || overrideAccess) {
    const payload = await getPayload({ config: configPromise })
    const { isEnabled: draft } = draftParam === undefined ? await draftMode() : { isEnabled: draftParam }

    try {
      let whereCondition: any = {
        slug: {
          equals: slug
        }
      };
      
      if (tenantId) {
        whereCondition.tenant = {
          equals: tenantId
        };
      }
      
      const pagesQuery = await payload.find({
        collection: 'project-pages',
        overrideAccess: overrideAccess || draft,
        draft,
        where: whereCondition,
        depth: 0,
        limit: 100,
      });
      
      if (pagesQuery.docs.length > 0) {
        const matchingPages = pagesQuery.docs.filter(page => {
          if (!page.slug) {
            return false;
          }
          return page.slug === slug;
        });
        
        if (matchingPages.length > 0) {
          return matchingPages[0] as ProjectPage;
        } else {
          console.log(`No page found with slug "${slug}"`);
        }
      } else {
        console.log('No project pages found');
      }
      
      return null;
    } catch (error: any) {
      console.error('Error querying pages:', error);
      return null;
    }
  }

  // Cache non-draft pages
  return await unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })

      try {
        let whereCondition: any = {
          slug: {
            equals: slug
          }
        };
        
        if (tenantId) {
          whereCondition.tenant = {
            equals: tenantId
          };
        }
        
        const pagesQuery = await payload.find({
          collection: 'project-pages',
          overrideAccess: false,
          draft: false,
          where: whereCondition,
          depth: 0,
          limit: 100,
        });
        
        if (pagesQuery.docs.length > 0) {
          const matchingPages = pagesQuery.docs.filter(page => {
            if (!page.slug) {
              return false;
            }
            return page.slug === slug;
          });
          
          if (matchingPages.length > 0) {
            return matchingPages[0] as ProjectPage;
          } else {
            console.log(`No page found with slug "${slug}"`);
          }
        } else {
          console.log('No project pages found');
        }
        
        return null;
      } catch (error: any) {
        console.error('Error querying pages:', error);
        return null;
      }
    },
    [CACHE_KEY.PROJECT_PAGE_BY_SLUG(slug || '')],
    {
      tags: [TAGS.PROJECT_PAGES],
      revalidate: false
    }
  )();
};

// Product Pages
export const queryProductPageBySlug = async ({
  slug,
  tenantId,
  overrideAccess = false,
  draft: draftParam,
}: {
  slug?: string
  tenantId?: number | null
  overrideAccess?: boolean
  draft?: boolean
}) => {
  // Don't cache draft pages
  if (draftParam || overrideAccess) {
    const payload = await getPayload({ config: configPromise })
    const { isEnabled: draft } = draftParam === undefined ? await draftMode() : { isEnabled: draftParam }

    try {
      let whereCondition: any = {
        slug: {
          equals: slug
        }
      };
      
      if (tenantId) {
        whereCondition.tenant = {
          equals: tenantId
        };
      }
      
      const pagesQuery = await payload.find({
        collection: 'product-pages',
        overrideAccess: overrideAccess || draft,
        draft,
        where: whereCondition,
        depth: 0,
        limit: 100,
      });
      
      if (pagesQuery.docs.length > 0) {
        const matchingPages = pagesQuery.docs.filter(page => {
          if (!page.slug) {
            return false;
          }
          return page.slug === slug;
        });
        
        if (matchingPages.length > 0) {
          return matchingPages[0] as ProductPage;
        } else {
          console.log(`No page found with slug "${slug}"`);
        }
      } else {
        console.log('No product pages found');
      }
      
      return null;
    } catch (error: any) {
      console.error('Error querying pages:', error);
      return null;
    }
  }

  // Cache non-draft pages
  return await unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })

      try {
        let whereCondition: any = {
          slug: {
            equals: slug
          }
        };
        
        if (tenantId) {
          whereCondition.tenant = {
            equals: tenantId
          };
        }
        
        const pagesQuery = await payload.find({
          collection: 'product-pages',
          overrideAccess: false,
          draft: false,
          where: whereCondition,
          depth: 0,
          limit: 100,
        });
        
        if (pagesQuery.docs.length > 0) {
          const matchingPages = pagesQuery.docs.filter(page => {
            if (!page.slug) {
              return false;
            }
            return page.slug === slug;
          });
          
          if (matchingPages.length > 0) {
            return matchingPages[0] as ProductPage;
          } else {
            console.log(`No page found with slug "${slug}"`);
          }
        } else {
          console.log('No product pages found');
        }
        
        return null;
      } catch (error: any) {
        console.error('Error querying pages:', error);
        return null;
      }
    },
    [CACHE_KEY.PRODUCT_PAGE_BY_SLUG(slug || '')],
    {
      tags: [TAGS.PRODUCT_PAGES],
      revalidate: false
    }
  )();
};

// Machinery
export const getMachinery = async (query = {}) => {
  return await unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      return payload.find({
        collection: 'machinery',
        ...query,
      })
    },
    [CACHE_KEY.MACHINERY()],
    {
      tags: [TAGS.MACHINERY],
      revalidate: false
    }
  )();
}

// Projects
export const getProjects = async (query = {}) => {
  return await unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      return payload.find({
        collection: 'projects',
        ...query,
      })
    },
    [CACHE_KEY.PROJECTS()],
    {
      tags: [TAGS.PROJECTS],
      revalidate: false
    }
  )();
}

export const getProject = async (slug: string, query = {}) => {
  return await unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const { docs } = await payload.find({
        collection: 'projects',
        where: { slug: { equals: slug } },
        ...query,
      })
      return docs[0] as Project | undefined
    },
    [CACHE_KEY.PROJECT_BY_SLUG(slug)],
    {
      tags: [TAGS.PROJECTS],
      revalidate: false
    }
  )();
}

export const getProjectById = async (projectId: number) => {
  return await unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.findByID({
        collection: 'projects',
        id: projectId,
      })
      return result
    },
    [CACHE_KEY.PROJECT_BY_ID(projectId)],
    {
      tags: [TAGS.PROJECTS],
      revalidate: false
    }
  )();
}

export const getProjectsByIds = async (projectIds: number[]) => {
  if (projectIds.length === 0) return [];
  
  return await unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const projects = await payload.find({
        collection: 'projects',
        where: { id: { in: projectIds } },
      })
      return projects.docs
    },
    [CACHE_KEY.PROJECTS_BY_IDS(projectIds)],
    {
      tags: [TAGS.PROJECTS],
      revalidate: false
    }
  )();
}


export const PRODUCT_BY_ID_TAG = async (id: string) => `product-by-id-${id}`;
export const getProductById = async (id: string | number) => {
  return await unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.findByID({
        collection: 'products',
        id,
      })
      return result
    },
    [CACHE_KEY.PRODUCT_BY_ID(String(id))],
    {
      tags: [TAGS.PRODUCTS],
      revalidate: false
    }
  )();
}

export const getProductsByIds = async (productIds: number[]) => {
  if (productIds.length === 0) return [];
  
  return await unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const products = await payload.find({
        collection: 'products',
        where: { id: { in: productIds } },
      })
      return products.docs
    },
    [CACHE_KEY.PRODUCTS_BY_IDS(productIds)],
    {
      tags: [TAGS.PRODUCTS],
      revalidate: false
    }
  )();
}

/**
 * Fetch all variants for a specific product (server-only)
 */
export const getProductVariants = async (productId: string): Promise<ProductVariant[]> => {
  return await unstable_cache(
    async () => {
      try {
        const payload = await getPayloadClient()
        
        const variants = await payload.find({
          collection: 'product-variants',
          where: {
            product: {
              equals: productId,
            },
          },
          depth: 2, // Ensure product relationship is populated with variantOptionTypes
          limit: 100, // Reasonable limit for product variants
        })
return variants.docs
        // return variants.docs.map(variant => ({
        //   id: String(variant.id),
        //   product: typeof variant.product === 'string' ? variant.product : String(variant.product?.id || ''),
        //   displayName: variant.displayName || undefined,
        //   color: variant.color || undefined,
        //   size: variant.size || undefined,
        //   variantSku: variant.variantSku,
        //   price: variant.price || undefined,
        //   inStock: variant.inStock,
        //   image: variant.image ? {
        //     id: typeof variant.image === 'string' ? variant.image : String(variant.image.id),
        //     url: typeof variant.image !== 'string' ? variant.image.url : undefined,
        //     alt: typeof variant.image !== 'string' ? variant.image.alt : undefined,
        //   } : undefined,
        // }))
      } catch (error) {
        console.error('Error fetching product variants:', error)
        return []
      }
    },
    [CACHE_KEY.PRODUCT_VARIANTS(productId)],
    {
      tags: [TAGS.PRODUCT_VARIANTS],
      revalidate: false
    }
  )();
}

export const getProductPagesByProductIds = async (productIds: number[]) => {
  if (productIds.length === 0) return [];
  
  return await unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'product-pages',
        where: {
          products: {
            in: productIds
          }
        },
        limit: 20,
        select: {
          id: true,
          slug: true,
          products: true,
        }
      })
      return result.docs
    },
    [CACHE_KEY.PRODUCT_PAGES_BY_PRODUCT_IDS(productIds)],
    {
      tags: [TAGS.PRODUCT_PAGES],
      revalidate: false
    }
  )();
}

export const getProductsWithSlugs = async (productIds: number[]) => {
  if (productIds.length === 0) return [];
  
  return await unstable_cache(
    async () => {
      // First get the products
      const products = await getProductsByIds(productIds);
      
      // Then get the product pages
      const productPages = await getProductPagesByProductIds(productIds);
      
      // Map products with their slugs
      return products.map((product) => {
        const productPage = productPages.find((page) => {
          const pageProductId = typeof page.products === 'object' && page.products !== null 
            ? page.products.id 
            : page.products;
          return pageProductId === product.id;
        });
        
        return {
          ...product,
          slug: productPage?.slug,
        }
      });
    },
    [CACHE_KEY.PRODUCTS_WITH_SLUGS(productIds)],
    {
      tags: [TAGS.PRODUCTS, TAGS.PRODUCT_PAGES],
      revalidate: false
    }
  )();
}