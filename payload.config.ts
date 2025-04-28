import { buildConfig } from 'payload'
import path from 'path'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { Users } from '@/collections/Users'
import { Media } from '@/collections/Media'
import { Projects } from '@/collections/Projects'
import { Testimonials } from '@/collections/Testimonials'
import { HomePage } from '@/globals/HomePage'
import { FaqItems } from '@/collections/FaqItems'
import { Services } from '@/collections/Services'
import { Ctas } from '@/collections/Ctas'
import { Inquiries } from '@/collections/Inquiries'
import { Navbar } from '@/globals/Navbar'
import { BusinessInfo } from '@/globals/BusinessInfo'
import { Machinery } from '@/collections/Machinery'
import { Tenants } from '@/collections/Tenants'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import type { CollectionConfig, GlobalConfig } from 'payload';
import type { GlobalAfterChangeHook } from 'payload';
import type { PayloadRequest } from 'payload';
import type { CollectionAfterChangeHook } from 'payload';
import type { Config } from './payload-types'

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
];

const allGlobals: GlobalConfig[] = [
  BusinessInfo,
  Navbar,
  HomePage,
];

if (!process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET is not set')
}

if (!process.env.PAYLOAD_PUBLIC_SERVER_URL) {
  throw new Error('PAYLOAD_PUBLIC_SERVER_URL is not set')
}

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  editor: lexicalEditor({}),
  collections: allCollections.map(addDeployHook),
  globals: allGlobals.map(addDeployHook),
  localization: {
    locales: [
      { label: 'Slovenščina', code: 'sl' },
    ],
    defaultLocale: 'sl',
    fallback: true,
  },
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
  plugins: [
    vercelBlobStorage({
      enabled: true,
      collections: {
        [Media.slug]: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
      clientUploads: true,
    }),
    multiTenantPlugin<Config>({
      enabled: true,
      debug: process.env.NODE_ENV !== 'production',
      tenantsSlug: Tenants.slug,
      collections: {
        [Projects.slug]: {},
        [Services.slug]: {},
        [Testimonials.slug]: {},
        [FaqItems.slug]: {},
        [Ctas.slug]: {},
        [Inquiries.slug]: {},
        [Machinery.slug]: {},
        [Media.slug]: {},
        [HomePage.slug]: { isGlobal: true },
        [Navbar.slug]: { isGlobal: true },
        [BusinessInfo.slug]: { isGlobal: true },
      },
    }),
  ],
  secret: process.env.PAYLOAD_SECRET,
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL
})