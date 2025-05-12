import type { Payload, PayloadRequest } from 'payload';
import type { Tenant, User, Config, Cta, Service, Project, FaqItem, OpeningHour, Menu, Form, Media, Testimonial, SubService } from '../../payload-types';

export interface SeedArgs {
  payload: Payload;
  config: Config; // Assuming Config is the generated config type
  tenantA1: Tenant;
  tenantMoj: Tenant; // Added for consistency if more tenants are handled this way
  userForGlobalUpdates: User;
  simulatedReq: PayloadRequest;
  imageAltMap: Map<string, string>;
  seededImageIds: { [key: string]: number }; // To store IDs of seeded images
  // For linking entities
  regularHours?: OpeningHour;
  ctaKontakt?: Cta;
  ctaVseStoritve?: Cta;
  mainMenu?: Menu;
  footerMenu?: Menu;
  socialMenu?: Menu;
  serviceVodoinstalacije?: Service;
  serviceMontaza?: Service;
  subServiceOdtok?: SubService;
  subServicePipe?: SubService;
  subServiceWC?: SubService;
  subServiceShower?: SubService;
  testimonial1?: Testimonial;
  testimonial2?: Testimonial;
  projectAdaptacija?: Project;
  projectNovogradnja?: Project;
  faq1?: FaqItem;
  faq2?: FaqItem;
  faq3?: FaqItem;
  contactForm?: Form;
  defaultSiteContactForm?: Form;
}

export const createSimulatedRequest = (payload: Payload, user: User): PayloadRequest => {
  return {
    payload,
    user,
    payloadAPI: 'local',
    transactionID: undefined,
    locale: 'sl', // From your config
    fallbackLocale: 'sl', // From your config
    context: {}, // Minimal context
    i18n: {
      t: (key: string) => key, // Simple pass-through translation
      locale: 'sl',
      fallbackLocale: 'sl',
      locales: ['sl', 'en'], // Match your payload.config.ts
      defaultLocale: 'sl',
    } as any, // Cast to any to simplify mocking
    payloadDataLoader: undefined,
    query: {}, // Empty query object
    t: (key: string) => key, // Minimal translation function placeholder
  } as any as PayloadRequest;
};

// Helper to safely get IDs, especially for related items in blocks
export const getServiceId = (service?: Service): number | undefined => service?.id;
export const getProjectId = (project?: Project): number | undefined => project?.id;
export const getTestimonialId = (testimonial?: Testimonial): number | undefined => testimonial?.id;
export const getFaqId = (faqItem?: FaqItem): number | undefined => faqItem?.id;
export const getCtaId = (cta?: Cta): number | undefined => cta?.id;
export const getOpeningHourId = (openingHour?: OpeningHour): number | undefined => openingHour?.id;
export const getMenuId = (menu?: Menu): number | undefined => menu?.id;
export const getFormId = (form?: Form): number | undefined => form?.id;
export const getMediaId = (media?: Media): number | undefined => media?.id;

// Helper for image alt text map if it becomes more complex or shared
export const createImageAltMap = (metadata: Array<{ filename: string; alt_text: string }>): Map<string, string> => {
  return new Map(metadata.map(item => [item.filename, item.alt_text]));
}; 