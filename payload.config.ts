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
import { Inquiries } from '@/collections/Inquiries/index'
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
import type { CollectionAfterChangeHook } from 'payload';
import type { Config } from './payload-types'
import { s3Storage } from '@payloadcms/storage-s3'
import { isSuperAdmin } from '@/access/isSuperAdminAccess'
import { getUserTenantIDs } from '@/utilities/getUserTenantIDs'
import { seed } from './src/seed'; // Import the seed function
import { Pages } from '@/collections/Pages';
import { Footer } from '@/globals/Footer';
import { Redirects } from '@/collections/Redirects'; // Import the new collection
import { Forms } from '@/collections/Forms'; // Import the Forms collection
import { Pricelists } from '@/collections/Pricelists'; // Import the new Pricelists collection
import { PriceListSections } from '@/collections/PriceListSections'; // Import new
import { PriceListItems } from '@/collections/PriceListItems'; // Import new
import { Banners } from '@/collections/Banners'; // Import the new Banners collection

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
        triggerVercelDeploy as any,
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
  Inquiries,
  Machinery,
  OpeningHours,
  Pages,
  Redirects, // Add the Redirects collection here
  Forms, // Add the Forms collection here
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
      title: 'Obrtnik na spletu',
      description: 'Obrtnik na spletu',

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
  plugins: [
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
    multiTenantPlugin<Config>({
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
        [Inquiries.slug]: {},
        [Machinery.slug]: {},
        [Media.slug]: {},
        [Pages.slug]: {},
        [OpeningHours.slug]: {},
        [Redirects.slug]: {}, // Add Redirects to multi-tenant config
        [Forms.slug]: {}, // Add Forms to multi-tenant config
        [Pricelists.slug]: {},
        [PriceListSections.slug]: {}, // Add new
        [PriceListItems.slug]: {}, // Add new
        [Banners.slug]: {}, // Add Banners to multi-tenant config
        [Menus.slug]: {}, // Add Menus to multi-tenant config
        // Globals seem to be handled differently or implicitly here
        // If you need explicit tenant control for globals like Footer, Navbar, BusinessInfo,
        // you might need to adjust how they are registered or how the plugin handles them.
        // Check the plugin documentation for handling globals.
        // Example (if needed and supported):
        // [Footer.slug]: { isGlobal: true },
        // [Navbar.slug]: { isGlobal: true },
        // [BusinessInfo.slug]: { isGlobal: true },
      },
    }),
  ],
  secret: process.env.PAYLOAD_SECRET,
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL
})