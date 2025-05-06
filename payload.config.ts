import { buildConfig } from 'payload'
import path, { dirname } from 'path'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { en } from '@payloadcms/translations/languages/en'
import { sl } from '@payloadcms/translations/languages/sl'
import Users from '@/collections/Users'
import { Media } from '@/collections/Media'
import { Projects } from '@/collections/Projects'
import { Testimonials } from '@/collections/Testimonials'
import { FaqItems } from '@/collections/FaqItems'
import { Services } from '@/collections/Services'
import { Ctas } from '@/collections/Ctas'

import { Navbar } from '@/globals/Navbar'
import { BusinessInfo } from '@/globals/BusinessInfo'
import { Machinery } from '@/collections/Machinery'
import { OpeningHours } from '@/collections/OpeningHours'
import { Tenants } from '@/collections/Tenants'
import { Menus } from '@/collections/Menus'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import type { CollectionConfig, GlobalConfig } from 'payload';
import type { GlobalAfterChangeHook } from 'payload';
import type { PayloadRequest } from 'payload';
import type { CollectionAfterChangeHook, CollectionSlug } from 'payload';
import type { Config, Tenant } from './payload-types'
import { s3Storage } from '@payloadcms/storage-s3'
import { isSuperAdmin } from '@/access/isSuperAdminAccess'
import { getUserTenantIDs } from '@/utilities/getUserTenantIDs'
import { seed } from './src/seed'; // Import the seed function
import { Pages } from '@/collections/Pages';
import { Footer } from '@/globals/Footer';
import { Redirects } from '@/collections/Redirects'; // Import the new collection
import { Pricelists } from '@/collections/Pricelists'; // Import the new Pricelists collection
import { PriceListSections } from '@/collections/PriceListSections'; // Import new
import { PriceListItems } from '@/collections/PriceListItems'; // Import new
import { Banners } from '@/collections/Banners'; // Import the new Banners collection
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder' // Import form builder plugin
import { seoPlugin } from '@payloadcms/plugin-seo'; // Import SEO plugin
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'; // Import nodemailer adapter

// Define a unified type for the hook
type UnifiedAfterChangeHook = CollectionAfterChangeHook | GlobalAfterChangeHook;

// Derive __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Vercel Deploy Hook URL & Settings
const VERCEL_DEPLOY_HOOK_URL = process.env.VERCEL_DEPLOY_HOOK_URL || 'https://api.vercel.com/v1/integrations/deploy/prj_ehvomvm2in1E8IQ7gLpB8k6gHFrM/oCopXvbRc';
const VERCEL_DEPLOY_HOOK_ENABLED = !!VERCEL_DEPLOY_HOOK_URL && process.env.NODE_ENV === 'production';

// Function to trigger Vercel deployment using the unified type
const triggerVercelDeploy: UnifiedAfterChangeHook = async ({ req }: { req: PayloadRequest }) => {
  if (!VERCEL_DEPLOY_HOOK_ENABLED) {
    req.payload.logger.info('Vercel deploy hook is disabled (not production or URL not set).');
    return;
  }

  req.payload.logger.info(`Change detected. Triggering Vercel deployment...`);

  try {
    const response = await fetch(VERCEL_DEPLOY_HOOK_URL, {
      method: 'POST',
    });
    if (response.ok) {
      req.payload.logger.info('Successfully triggered Vercel deployment.');
    } else {
      const errorText = await response.text();
      req.payload.logger.error(`Failed to trigger Vercel deployment: ${response.status} ${errorText}`);
    }
  } catch (error: unknown) {
     if (error instanceof Error) {
       req.payload.logger.error(`Error triggering Vercel deployment: ${error.message}`);
     } else {
       req.payload.logger.error('An unknown error occurred while triggering Vercel deployment.');
     }
  }
};

// Helper function to add the deploy hook to a config (Collection or Global)
// Ensures existing hooks are preserved
const addDeployHook = <T extends CollectionConfig | GlobalConfig>(config: T): T => {
  const existingHooks = config.hooks || {};
  const existingAfterChange = (existingHooks.afterChange || []) as UnifiedAfterChangeHook[];

  // Avoid adding the hook multiple times if config is somehow processed more than once
  if (existingAfterChange.some(hook => hook === triggerVercelDeploy)) {
    return config;
  }

  return {
    ...config,
    hooks: {
      ...existingHooks,
      afterChange: [
        ...existingAfterChange,
        triggerVercelDeploy as any, // Cast needed because hook types might not perfectly align depending on context
      ],
    },
  };
};

// Original collections and globals arrays
const allCollections: CollectionConfig[] = [
  Tenants,
  Users,
  Media,
  Projects,
  Services,
  Testimonials,
  FaqItems,
  Ctas,
  Machinery,
  OpeningHours,
  Pages,
  Redirects, // Add the Redirects collection here
  Pricelists, // Add the Pricelists collection here
  PriceListSections, // Add new
  PriceListItems, // Add new
  Banners, // Add the Banners collection here
  Menus, // Add the Menus collection here
];

const allGlobals: GlobalConfig[] = [
  BusinessInfo,
  Navbar,
  Footer,
];

if (!process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET is not set')
}

if (!process.env.NEXT_PUBLIC_SERVER_URL) {
  throw new Error('NEXT_PUBLIC_SERVER_URL is not set')
}

export default buildConfig({
  admin: {
    
    importMap: {
      baseDir: path.resolve(__dirname, 'src'),
    },
    meta: {
      title: 'Admin - Obrtnik na spletu',
      description: 'Administracija za spletno stran Obrtnik na spletu.',

      icons:[
        {
          rel: 'favicon',
          url: '/favicon.ico',
        },
        {
          rel:"32x32",
          url: '/favicon-32x32.png',
        },
        {
          rel:"16x16",
          url: '/favicon-16x16.png',
        },
        {
          rel:"apple-touch-icon",
          url: '/apple-touch-icon.png',
        },
        {
          rel:"android-chrome-192x192",
          url: '/android-chrome-192x192.png',
        },
        {
          rel:"android-chrome-512x512",
          url: '/android-chrome-512x512.png',
        },
        
      ],
    },
    user: Users.slug,
    components: {
      graphics: {
        Logo: '/graphics/Logo/index.tsx#Logo',
      },
    },
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  editor: lexicalEditor({}),
  onInit: async (args) => {
    if (process.env.SEED === 'true') {
      await seed(args)
    }
  },
  i18n: {
    supportedLanguages: { en, sl },
    fallbackLanguage: 'sl',
  },
  collections: allCollections.map(addDeployHook),
  globals: allGlobals.map(addDeployHook),

  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  // onInit: async (payload) => {
  //     await seed(payload);
  // },
  email: nodemailerAdapter({
    defaultFromAddress: process.env.DEFAULT_FROM_EMAIL || 'ne-odgovarjaj@obrtniknaspletu.si',
    defaultFromName: process.env.DEFAULT_FROM_NAME || 'Obrtnik na spletu',
    transportOptions: {
      host: process.env.BREVO_SMTP_HOST,
      port: parseInt(process.env.BREVO_SMTP_PORT || '587', 10), // Ensure port is a number
      auth: {
        user: process.env.BREVO_SMTP_LOGIN,
        pass: process.env.BREVO_SMTP_KEY, // Use the second BREVO_SMTP_KEY for the password
      },
      // secure: true, // Use true if your SMTP server uses SSL/TLS on port 465. Brevo typically uses port 587 with STARTTLS, so secure: false (default) is often correct.
                     // If you use port 465, set secure: true. For port 587, secure is usually false because STARTTLS is used.
    },
  }),
  plugins: [
    formBuilderPlugin({
      redirectRelationships: [Pages.slug], // Use Pages collection slug for redirects
      // Override default fields or add custom ones if needed
      defaultToEmail: process.env.DEFAULT_TO_EMAIL || 'matija@obrtniknaspletu.si',
      // fields: { ... }, 
      // Add deploy hook to form and submission collections
      formOverrides: {
        labels:{
          singular:"Obrazec",
          plural:"Obraci",
        },
        admin:{
          group:"Prodaja",

        },
        hooks: {
          afterChange: [triggerVercelDeploy as CollectionAfterChangeHook],
        },
        // Add other overrides like access control if needed for multi-tenancy
        // access: { ... },
      },
      formSubmissionOverrides: {
        labels:{
          singular:"Povpraševanje",
          plural:"Povpraševanja",
        },
        admin:{
          group:"Prodaja",
          
        }
        // Remove the deploy hook as it's not needed for submissions
        // hooks: {
        //   afterChange: [triggerVercelDeploy as CollectionAfterChangeHook],
        // },
        // Add other overrides like access control if needed for multi-tenancy
        // access: { ... },
      },
    }),
    s3Storage({
      collections: {
        [Media.slug]: true,
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT || '',
        region: 'auto',
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET || '',
        },
        forcePathStyle: true,
      },
    }),
    seoPlugin({ // Configure SEO Plugin
      collections: [
        Pages.slug,
        Projects.slug,
        Services.slug,
      ],
      uploadsCollection: Media.slug,
      tabbedUI: true, // Enable tabbed UI
      generateTitle: ({ doc }) => `Obrtnik na spletu — ${doc?.title ?? ''}`, // Basic title generation
      generateDescription: ({ doc }) => doc?.excerpt ?? '', // Use excerpt field if available
      generateImage: ({ doc }) => doc?.featuredImage ?? null, // Use featuredImage field if available
      generateURL: async ({ doc, collectionSlug, req }) => {
        const payload = req.payload;
        // Default to the site URL from env, fallback to localhost for dev
        const defaultBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        let baseUrl = defaultBaseUrl;
        let path = '/';

        const tenantId = typeof doc?.tenant === 'object' ? doc.tenant?.id : doc?.tenant;

        if (tenantId) {
          try {
            const tenant = await payload.findByID({
              collection: Tenants.slug as CollectionSlug,
              id: tenantId,
              depth: 0,
            }) as Tenant;

            if (tenant) {
               if (tenant.domain) {
                 baseUrl = `https://${tenant.domain}`;
               } else {
                 // Construct URL using tenant slug structure
                 baseUrl = `${defaultBaseUrl}/tenant-slugs/${tenant.slug}`;
               }
            }
          } catch (error) {
            payload.logger.error(`Error fetching tenant ${tenantId} for SEO URL generation: ${error instanceof Error ? error.message : error}`);
            // Fallback to default base URL if tenant fetch fails
          }
        }

        // Construct path based on collection and slug
        // Assuming Pages are routed at the root of the tenant/site, others are nested
        if (collectionSlug === Pages.slug) {
          path = `/${doc?.slug ?? ''}`;
        } else {
          path = `/${collectionSlug}/${doc?.slug ?? ''}`;
        }

        // Combine base URL and path, ensuring no double slashes
        const fullUrl = `${baseUrl}${path}`.replace(/([^:]\/)\/+/g, '$1');
        return fullUrl;
      }
    }),
    multiTenantPlugin<Config>({ // Multi-Tenant plugin should generally come after other plugins modifying collections
      tenantField: {
        access: {
          read: () => true,
          update: ({ req }) => {
            if (isSuperAdmin(req.user)) {
              return true
            }
            return getUserTenantIDs(req.user).length > 0
          },
        },
      },
      tenantsArrayField: {
        includeDefaultField: false,
      },
      userHasAccessToAllTenants: (user) => isSuperAdmin(user),
      collections: {
        [Projects.slug]: {},
        [Services.slug]: {},
        [Testimonials.slug]: {},
        [FaqItems.slug]: {},
        [Ctas.slug]: {},
        [Machinery.slug]: {},
        [Media.slug]: {},
        [Pages.slug]: {},
        [OpeningHours.slug]: {},
        [Redirects.slug]: {},
        'forms': {}, // Add default form builder collection slug
        'form-submissions': {}, // Add default form builder submissions slug
        [Pricelists.slug]: {},
        [PriceListSections.slug]: {}, // Add new
        [PriceListItems.slug]: {}, // Add new
        [Banners.slug]: {},
        [Menus.slug]: {},
      } as any, // Cast to any to bypass strict type checking for dynamic slugs
    }),
  ],
  secret: process.env.PAYLOAD_SECRET,
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL
})