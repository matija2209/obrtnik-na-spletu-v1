// src/lib/payload/cache-keys.ts

// Collection-level cache tags
export const TAGS = {
  SERVICES: "services",
  TESTIMONIALS: "testimonials", 
  MEDIA: "media",
  PAGES: "pages",
  SERVICE_PAGES: "service-pages",
  PROJECT_PAGES: "project-pages",
  PRODUCT_PAGES: "product-pages",
  PROJECTS: "projects",
  PRODUCTS: "products",
  MACHINERY: "machinery",
  CTAS: "ctas",
  FAQ_ITEMS: "faq-items",
  FORMS: "forms",
  NAVBAR: "navbar",
  FOOTER: "footer",
  BUSINESS_INFO: "business-info",
  FACEBOOK_PAGES: "facebook-pages",
  SUB_SERVICES: "sub-services",
  PRODUCT_VARIANTS: "product-variants",
  MENUS: "menus",
} as const;

// Cache key functions
export const CACHE_KEY = {
  // Services
  SERVICES: () => "services-all",
  SERVICE_BY_SLUG: (slug: string) => `service-by-slug-${slug}`,
  SERVICE_BY_ID: (id: number) => `service-by-id-${id}`,
  SERVICES_BY_IDS: (ids: number[]) => `services-by-ids-${ids.sort().join('-')}`,
  
  // Sub-Services
  SUB_SERVICES: () => "sub-services-all",
  SUB_SERVICE_BY_ID: (id: number) => `sub-service-by-id-${id}`,
  SUB_SERVICES_BY_IDS: (ids: number[]) => `sub-services-by-ids-${ids.sort().join('-')}`,
  
  // Testimonials
  TESTIMONIALS: () => "testimonials-all",
  TESTIMONIAL_BY_ID: (id: number) => `testimonial-by-id-${id}`,
  TESTIMONIALS_BY_IDS: (ids: number[]) => `testimonials-by-ids-${ids.sort().join('-')}`,
  
  // Media
  MEDIA: () => "media-all",
  IMAGE_BY_ID: (id: number, collection: string = "media") => `${collection}-by-id-${id}`,
  MEDIA_IMAGES: (ids: number[]) => `media-images-${ids.sort().join('-')}`,
  
  // Pages
  PAGE_BY_SLUG: (slug?: string[]) => {
    const slugStr = slug && slug.length > 0 ? slug.join('-') : 'home'; 
    return `page-${slugStr}`;
  },
  
  // Static Paths
  STATIC_PATHS: () => "static-paths-all",
  
  // Service Pages
  SERVICE_PAGE_BY_SLUG: (slug: string) => `service-page-${slug}`,
  
  // Project Pages
  PROJECT_PAGE_BY_SLUG: (slug: string) => `project-page-${slug}`,
  
  // Product Pages
  PRODUCT_PAGE_BY_SLUG: (slug: string) => `product-page-${slug}`,
  
  // Projects
  PROJECTS: () => "projects-all",
  PROJECT_BY_SLUG: (slug: string) => `project-by-slug-${slug}`,
  PROJECT_BY_ID: (id: number) => `project-by-id-${id}`,
  PROJECTS_BY_IDS: (ids: number[]) => `projects-by-ids-${ids.sort().join('-')}`,
  
  // Products
  PRODUCTS: () => "products-all",
  PRODUCT_BY_ID: (id: string) => `product-by-id-${id}`,
  PRODUCTS_BY_IDS: (ids: number[]) => `products-by-ids-${ids.sort().join('-')}`,
  PRODUCTS_WITH_SLUGS: (ids: number[]) => `products-with-slugs-${ids.sort().join('-')}`,
  PRODUCT_VARIANTS: (productId: string) => `product-variants-${productId}`,
  PRODUCT_PAGES_BY_PRODUCT_IDS: (ids: number[]) => `product-pages-by-product-ids-${ids.sort().join('-')}`,
  
  // Machinery
  MACHINERY: () => "machinery-all",
  
  // CTAs
  CTAS: () => "ctas-all",
  CTA_BY_ID: (id: number) => `cta-by-id-${id}`,
  CTAS_BY_IDS: (ids: number[]) => `ctas-by-ids-${ids.sort().join('-')}`,
  
  // FAQ Items
  FAQ_ITEMS: () => "faq-items-all",
  FAQ_ITEM_BY_ID: (id: number) => `faq-item-by-id-${id}`,
  FAQ_ITEMS_BY_IDS: (ids: number[]) => `faq-items-by-ids-${ids.sort().join('-')}`,
  
  // Globals
  NAVBAR: () => "navbar-global",
  FOOTER: () => "footer-global",
  BUSINESS_INFO: () => "business-info-global",
  
  // Facebook
  FACEBOOK_PAGES: () => "facebook-pages-all",
  
  // Forms
  FORMS: () => "forms-all",
  FORM_BY_ID: (id: number) => `form-by-id-${id}`,
  
  // Form submissions
  FORM_SUBMISSIONS: (limit: number) => `form-submissions-latest-${limit}`,
} as const; 