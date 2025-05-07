# Feature Plan: Multi-Tenant Theming

## Architecture Overview

*   Store tenant configurations in Payload CMS.
*   Generate and store CSS files in Cloudflare R2.
*   Build-time fetch for known tenants.
*   Optional runtime fetch for new tenants added between deployments.

## Step 1: Set Up Tenant Configuration in Payload CMS

Create a `Tenant` collection in Payload CMS. This will store color theming and typography choices for each tenant.

```javascript
// Payload CMS collection (Tenants)
export const Tenants = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug', // This will be your tenantId
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'colors',
      type: 'group',
      fields: [
        {
          name: 'primary',
          type: 'text',
          defaultValue: 'oklch(49.12% 0.178 263.4)',
        },
        {
          name: 'secondary',
          type: 'text',
          defaultValue: 'oklch(65.45% 0.121 142.8)',
        },
        {
          name: 'accent',
          type: 'text',
          defaultValue: 'oklch(0.77 0.1687 67.36)',
        },
        // Add more color variables as needed
      ],
    },
    {
      name: 'typography',
      type: 'group',
      label: 'Typography (Google Fonts via next/font)',
      fields: [
        {
          name: 'displayFont',
          type: 'group',
          label: 'Display Font (Headings)',
          fields: [
            {
              name: 'name', // e.g., "Roboto", "Open_Sans"
              label: 'Font Name',
              type: 'select',
              required: true,
              defaultValue: 'Inter',
              options: [ // Predefined list of supported Google Fonts
                { label: 'Inter', value: 'Inter' },
                { label: 'Roboto', value: 'Roboto' },
                { label: 'Open Sans', value: 'Open_Sans' },
                { label: 'Lato', value: 'Lato' },
                { label: 'Montserrat', value: 'Montserrat' },
                // Add other Google Fonts you want to support
              ],
              admin: { description: "Select a Google Font. Ensure it matches the 'next/font/google' import name (e.g., 'Open_Sans' for Open Sans)." }
            },
            {
              name: 'weights', // e.g., ["400", "700"]
              label: 'Font Weights',
              type: 'array',
              minRows: 1,
              fields: [{ name: 'weight', type: 'text', required: true, admin: { description: "e.g., '400', '700', 'variable' if it's a variable font."} }],
              defaultValue: [{ weight: '700' }],
            },
            {
              name: 'variableName',
              label: 'CSS Variable Name',
              type: 'text',
              defaultValue: '--font-display-tenant',
              admin: { readOnly: true, description: "Auto-generated CSS variable for 'next/font'." }
            },
            {
                name: 'subsets',
                label: 'Subsets (Optional)',
                type: 'array',
                fields: [{ name: 'subset', type: 'text', required: true, admin: { description: "e.g., 'latin', 'latin-ext'. Defaults to 'latin'."}}],
                defaultValue: [{ subset: 'latin' }]
            }
          ]
        },
        {
          name: 'bodyFont',
          type: 'group',
          label: 'Body Font (Paragraphs)',
          fields: [
            {
              name: 'name',
              label: 'Font Name',
              type: 'select',
              required: true,
              defaultValue: 'Inter',
              options: [ // Keep consistent with displayFont options
                { label: 'Inter', value: 'Inter' },
                { label: 'Roboto', value: 'Roboto' },
                { label: 'Open Sans', value: 'Open_Sans' },
                { label: 'Lato', value: 'Lato' },
                { label: 'Montserrat', value: 'Montserrat' },
              ],
              admin: { description: "Select a Google Font." }
            },
            {
              name: 'weights',
              label: 'Font Weights',
              type: 'array',
              minRows: 1,
              fields: [{ name: 'weight', type: 'text', required: true }],
              defaultValue: [{ weight: '400' }],
            },
            {
              name: 'variableName',
              label: 'CSS Variable Name',
              type: 'text',
              defaultValue: '--font-body',
              admin: { readOnly: true, description: "Auto-generated CSS variable for 'next/font'." }
            },
            {
                name: 'subsets',
                label: 'Subsets (Optional)',
                type: 'array',
                fields: [{ name: 'subset', type: 'text', required: true }],
                defaultValue: [{ subset: 'latin' }]
            }
          ]
        },
      ],
    },
    // Other theme properties like logo override, etc.
  ],
  hooks: {
    // afterChange hook will be defined in Step 2
    afterChange: [/* defined_in_step_2_afterChangeHook */],
  }
};
```
**Action:** Update your `Tenants` collection definition. Regenerate Payload types (`pnpm payload generate:types`).

## Step 2: Create Tenant Asset Generation Process (CSS & Font Config)

Add a hook to Payload that generates and uploads tenant-specific assets (CSS for colors, JSON for font configuration) when a tenant's theme settings are created or updated. These assets will be stored in Cloudflare R2.

The `generateTenantCSS` utility will now generate CSS that references the font variables provided by `next/font/google`, rather than defining `font-family` directly with font names.

**File:** `src/utilities/css-generator.ts` (or equivalent)
```typescript
// Inside your generateTenantCSS function:
import type { Tenant } from 'payload-types'; // Assuming generated types

export function generateTenantCSS(tenant: Tenant): string {
  const { colors, typography } = tenant;
  const cssVariables: string[] = [];

  // Color variables (existing logic)
  if (colors?.primary) cssVariables.push(`  --color-primary: ${colors.primary};`);
  if (colors?.secondary) cssVariables.push(`  --color-secondary: ${colors.secondary};`);
  if (colors?.accent) cssVariables.push(`  --color-accent: ${colors.accent};`);
  // ... add other color variables

  // Font variables
  // These variables (--font-family-display/body) will be used by Tailwind or global CSS.
  // They will point to the variables generated by next/font (e.g., var(--font-display-tenant)).
  if (typography?.displayFont?.variableName) {
    cssVariables.push(`  --font-family-display: var(${typography.displayFont.variableName});`);
  }
  if (typography?.bodyFont?.variableName) {
    cssVariables.push(`  --font-family-body: var(${typography.bodyFont.variableName});`);
  }

  if (cssVariables.length === 0) {
    return '/* No tenant-specific styles defined */';
  }

  return `:root {
${cssVariables.join('\\n')}
}`;
}
```
**Action:** Update the `generateTenantCSS` utility function.

The `afterChange` hook for the `Tenants` collection needs to:
1.  Process the updated `colors` and `typography` fields.
2.  Generate and upload tenant-specific CSS to R2.
3.  Generate and upload a tenant-specific theme configuration JSON file to R2 (e.g., `tenant-configs/${tenantSlug}.json`). This file will be fetched by `RootLayout` to get the structured font data needed for `next/font/google`.

**File:** Payload hook file (e.g., `src/collections/Tenants/hooks/afterChange.ts` or integrated into `payload.config.ts`)
```typescript
// In your Payload config (e.g., payload.config.ts or a hook file)
import { CollectionAfterChangeHook, Payload } from 'payload';
import { r2 } from '@/lib/r2-client'; // (Exists at src/lib/r2-client.ts)
import { generateTenantCSS } from '@/utilities/css-generator'; // (Exists at src/utilities/css-generator.ts)
import type { Tenant } from 'payload-types';

// This function handles CSS, Theme Config JSON, Manifest, and Versions
async function processAndUploadTenantAssets(tenant: Tenant, payload: Payload) {
  const cssFileName = `tenant-styles/${tenant.slug}.css`;
  const configFileName = `tenant-configs/${tenant.slug}.json`; // New config file for fonts
  const manifestFileName = 'tenant-styles/manifest.json';
  const versionsFileName = 'tenant-styles/versions.json';

  try {
    payload.logger.info(`Processing assets for tenant ${tenant.slug}`);

    // 1. Generate and Upload CSS
    const css = generateTenantCSS(tenant);
    const cssUploadResult = await r2.uploadFile(cssFileName, css, {
        contentType: 'text/css',
        cacheControl: 'public, max-age=3600', // 1 hour, rely on versioning
    });
    if (!cssUploadResult.success) {
      payload.logger.error(`Failed to upload CSS for ${tenant.slug}: ${cssUploadResult.error}`);
    } else {
      payload.logger.info(`Successfully uploaded CSS for ${tenant.slug}.`);
    }

    // 2. Prepare and Upload Tenant Theme Configuration JSON (for fonts)
    const themeConfig = {
      slug: tenant.slug,
      colors: tenant.colors, // Include colors if layout might need them, or just typography
      typography: {
        displayFont: tenant.typography?.displayFont ? {
          name: tenant.typography.displayFont.name,
          weights: tenant.typography.displayFont.weights?.map(w => w.weight),
          variableName: tenant.typography.displayFont.variableName ,
          subsets: tenant.typography.displayFont.subsets?.map(s => s.subset),
        } : undefined,
        bodyFont: tenant.typography?.bodyFont ? {
          name: tenant.typography.bodyFont.name,
          weights: tenant.typography.bodyFont.weights?.map(w => w.weight),
          variableName: tenant.typography.bodyFont.variableName,
          subsets: tenant.typography.bodyFont.subsets?.map(s => s.subset),
        } : undefined,
      },
    };

    payload.logger.info(`Uploading theme config for tenant ${tenant.slug} to ${configFileName}`);
    const configUploadResult = await r2.uploadFile(configFileName, JSON.stringify(themeConfig, null, 2), {
      contentType: 'application/json',
      cacheControl: 'public, max-age=300', // 5 minutes cache for config
    });
    if (!configUploadResult.success) {
      payload.logger.error(`Failed to upload theme config for ${tenant.slug}: ${configUploadResult.error}`);
    } else {
      payload.logger.info(`Successfully uploaded theme config for ${tenant.slug}.`);
    }

    // 3. Update Manifest and Version files (for CSS and potentially for config if needed)
    payload.logger.info('Updating manifest and version files...');
    const allTenantsResult = await payload.find({
      collection: 'tenants',
      limit: 1000,
      depth: 0,
      overrideAccess: false, // Consider if admin access is needed here
    });

    const tenantSlugs = allTenantsResult.docs.map(t => t.slug);
    const manifestUploadResult = await r2.uploadFile(manifestFileName, JSON.stringify(tenantSlugs), {
      contentType: 'application/json',
      cacheControl: 'public, max-age=60', // 1 minute cache
    });
    if (!manifestUploadResult.success) {
         payload.logger.error(`Failed to upload manifest file: ${manifestUploadResult.error}`);
    } else {
         payload.logger.info('Manifest file updated.');
    }

    let versions: Record<string, number> = {};
    try {
        const versionDataString = await r2.getFileAsString(versionsFileName);
        versions = JSON.parse(versionDataString);
        if (typeof versions !== 'object' || versions === null) versions = {};
    } catch (e: any) {
        if (e.message?.includes('NoSuchKey') || e.message?.includes('not found')) {
             payload.logger.info('Versions file not found, creating new one.');
        } else {
             payload.logger.error(`Error fetching/parsing versions file: ${e.message}`);
        }
        versions = {};
    }

    versions[tenant.slug] = Date.now(); // Update timestamp for this tenant
    const versionsUploadResult = await r2.uploadFile(versionsFileName, JSON.stringify(versions), {
        contentType: 'application/json',
        cacheControl: 'public, max-age=60', // 1 minute cache
    });
    if (!versionsUploadResult.success) {
        payload.logger.error(`Failed to upload versions file: ${versionsUploadResult.error}`);
    } else {
         payload.logger.info('Versions file updated.');
    }

  } catch (error: any) {
    payload.logger.error(`Error processing assets for tenant ${tenant.slug}: ${error?.message || error}`);
  }
}

const afterChangeHook: CollectionAfterChangeHook<Tenant> = async ({ doc, req }) => {
  if (doc && doc.slug) { // Ensure doc and slug exist
    await processAndUploadTenantAssets(doc, req.payload);
  } else {
    req.payload.logger.warn(`Tenant document ${doc?.id} is missing required fields for asset generation.`);
  }
};

// Ensure this hook is added to your Tenants collection definition (Step 1)
// export const Tenants = { ... hooks: { afterChange: [afterChangeHook] } ... };
```
**Action:** Update the `afterChange` hook in your Payload CMS setup. Test thoroughly after a tenant's theme is saved.
**Note:** Ensure your `r2-client`'s `uploadFile` and `getFileAsString` methods are robust and handle R2 interactions correctly.

## Step 3: Fetching and Applying Tenant Styles & Fonts (Dynamic Approach Recommended)

For real-time updates of both color themes and custom fonts, the dynamic fetching approach is recommended.

### Approach A: Build-Time Fetch (Less Dynamic for Fonts)
This approach can still be used for color CSS, but it's less ideal for dynamic font configurations as it would require a rebuild to reflect new font choices or new tenants' font settings. If using this for CSS, font configurations would still need to be fetched dynamically as described in Approach B.

...(content of Approach A from original FEATURE_PLAN_TENANT_THEMING.md remains largely the same, focusing on CSS)

### Approach B: Dynamic CSS & Font Config Fetching with Revalidation (Recommended)

The `RootLayout` will fetch:
1.  The tenant's color CSS stylesheet from R2.
2.  The tenant's theme configuration JSON (which includes font details) from R2.
It will then use `next/font/google` to load the specified fonts and apply their CSS variables, along with the color CSS.

**File:** `src/app/(frontend)/layout.tsx`
```tsx
import './globals.css'; // Contains base Tailwind import and DEFAULT @theme definitions
import { headers, draftMode } from 'next/headers';
import { AdminBar } from '@/components/admin/admin-bar';
import React from 'react';
import type { NextFont } from 'next/dist/compiled/@next/font';

// Import all Google fonts you plan to support by their 'next/font/google' names
import { Inter, Roboto, Open_Sans, Lato, Montserrat } from 'next/font/google';
// Add other fonts as needed, matching the 'name' in Payload options

const S3_PUBLIC_ENDPOINT = process.env.S3_PUBLIC_ENDPOINT || process.env.S3_ENDPOINT; // Your R2 public endpoint

// Map of available font loaders, keys must match 'name' field from Payload
const fontLoaders: Record<string, (options: any) => NextFont> = {
  Inter,
  Roboto,
  Open_Sans, // Note: 'Open Sans' in Payload would map to 'Open_Sans' here
  Lato,
  Montserrat,
};

interface FontConfigPayload {
  name?: string;
  weights?: string[];
  variableName?: string;
  subsets?: string[];
}

interface TenantThemeConfig {
  slug?: string;
  typography?: {
    displayFont?: FontConfigPayload;
    bodyFont?: FontConfigPayload;
  };
  // colors field can also be part of this if needed, though CSS handles it directly
}

// Default font configurations (used as fallback)
const defaultDisplayFontConfig: Required<FontConfigPayload> = {
  name: 'Inter',
  weights: ['700'],
  variableName: '--font-display-tenant',
  subsets: ['latin'],
};
const defaultBodyFontConfig: Required<FontConfigPayload> = {
  name: 'Inter',
  weights: ['400'],
  variableName: '--font-body',
  subsets: ['latin'],
};

async function getTenantThemeConfig(tenantSlug: string): Promise<TenantThemeConfig> {
  if (!S3_PUBLIC_ENDPOINT) {
    console.warn("S3_PUBLIC_ENDPOINT not set. Using default theme config for fonts.");
    return { typography: { displayFont: defaultDisplayFontConfig, bodyFont: defaultBodyFontConfig } };
  }
  try {
    // Cache bust with a timestamp for development or use version from versions.json
    const configUrl = `${S3_PUBLIC_ENDPOINT}/tenant-configs/${tenantSlug}.json?v=${Date.now()}`;
    const res = await fetch(configUrl, { next: { revalidate: 300 } }); // Revalidate every 5 mins

    if (!res.ok) {
      console.warn(`Failed to fetch theme config for ${tenantSlug} (${res.status}). Using defaults.`);
      if (tenantSlug !== 'default') {
        const defaultConfigUrl = `${S3_PUBLIC_ENDPOINT}/tenant-configs/default.json?v=${Date.now()}`;
        const defaultRes = await fetch(defaultConfigUrl, { next: { revalidate: 300 } });
        if (defaultRes.ok) return (await defaultRes.json()) as TenantThemeConfig;
      }
      return { typography: { displayFont: defaultDisplayFontConfig, bodyFont: defaultBodyFontConfig } };
    }
    return (await res.json()) as TenantThemeConfig;
  } catch (error) {
    console.error(`Error fetching theme config for ${tenantSlug}:`, error);
    return { typography: { displayFont: defaultDisplayFontConfig, bodyFont: defaultBodyFontConfig } };
  }
}

async function getTenantStyles(tenantSlug: string): Promise<{ css: string; usingFallback: boolean; version: string | number }> {
  let useFallbackStyles = false;
  let tenantCSS = '';
  let cssVersion: string | number = Date.now(); // Fallback version

  if (!S3_PUBLIC_ENDPOINT) {
    console.error("S3_PUBLIC_ENDPOINT not set. Cannot fetch tenant styles.");
    return { css: '', usingFallback: true, version: cssVersion };
  }

  try {
    const versionsUrl = `${S3_PUBLIC_ENDPOINT}/tenant-styles/versions.json?v=${Date.now()}`;
    const versionRes = await fetch(versionsUrl, { next: { revalidate: 60 } });
    if (versionRes.ok) {
      const versions = await versionRes.json();
      cssVersion = versions[tenantSlug] || cssVersion;
    } else {
      console.warn(`Failed to fetch versions.json (${versionRes.status}).`);
    }
  } catch (e) {
    console.error('Error fetching tenant versions:', e);
  }

  try {
    const cssUrl = `${S3_PUBLIC_ENDPOINT}/tenant-styles/${tenantSlug}.css?v=${cssVersion}`;
    const cssRes = await fetch(cssUrl, { next: { revalidate: 300 } });

    if (cssRes.ok) {
      tenantCSS = await cssRes.text();
    } else {
      console.warn(`Failed to fetch CSS for ${tenantSlug} (${cssRes.status}). Trying default.`);
      useFallbackStyles = true;
      if (tenantSlug !== 'default') {
        const defaultCssVersion = (await (await fetch(`${S3_PUBLIC_ENDPOINT}/tenant-styles/versions.json?v=${Date.now()}`, { next: { revalidate: 60 } })).json())?.['default'] || Date.now();
        const defaultCssUrl = `${S3_PUBLIC_ENDPOINT}/tenant-styles/default.css?v=${defaultCssVersion}`;
        const defaultCssRes = await fetch(defaultCssUrl, { next: { revalidate: 300 } });
        if (defaultCssRes.ok) {
          tenantCSS = await defaultCssRes.text();
          console.log('Successfully fell back to default tenant CSS');
        } else {
          console.warn(`Failed to fetch default CSS (${defaultCssRes.status}).`);
        }
      }
    }
  } catch (e) {
    console.error(`Error fetching tenant CSS for ${tenantSlug}:`, e);
    useFallbackStyles = true;
  }
  return { css: tenantCSS, usingFallback: useFallbackStyles, version: cssVersion };
}


export default async function RootLayout({ children }: { children: React.ReactNode }) {
  'use server';

  const { isEnabled: isDraftMode } = draftMode();
  const headersList = headers();
  const tenantSlug = headersList.get('X-Tenant-Slug') || 'default';

  // Fetch Tenant-Specific Color Styles
  const { css: tenantCSS, usingFallback: useFallbackStyles } = await getTenantStyles(tenantSlug);

  // Fetch Tenant Font Configuration and Load Fonts
  const themeConfig = await getTenantThemeConfig(tenantSlug);
  const displayFontSettings = themeConfig.typography?.displayFont || defaultDisplayFontConfig;
  const bodyFontSettings = themeConfig.typography?.bodyFont || defaultBodyFontConfig;

  const activeFontClasses: string[] = [];

  const loadFont = (config: FontConfigPayload | undefined, defaultConf: Required<FontConfigPayload>) => {
    // Prioritize tenant's config, then default. Ensure name exists.
    const chosenName = config?.name || defaultConf.name;
    const fontLoader = fontLoaders[chosenName];

    // Use tenant's specific settings if available and font name matches, otherwise use defaults for that font loader
    const chosenConfig = (config && config.name === chosenName) ? config : defaultConf;
    
    // Ensure essential properties for fontLoader exist, falling back to defaultConf for structure
    const weights = chosenConfig.weights?.length ? chosenConfig.weights : defaultConf.weights;
    const subsets = chosenConfig.subsets?.length ? chosenConfig.subsets : defaultConf.subsets;
    const variableName = chosenConfig.variableName || defaultConf.variableName;

    if (fontLoader) {
      try {
        const font = fontLoader({
          subsets: subsets,
          weight: weights,
          variable: variableName,
          display: 'swap',
        });
        activeFontClasses.push(font.variable);
        return font; // Return the font object if needed elsewhere
      } catch (e) {
        console.error(`Error loading font ${chosenName} with weights ${weights}: `, e);
      }
    }
    console.warn(`Font loader for "${chosenName}" not found or failed to load. Using fallback Inter for this slot.`);
    // Fallback to Inter if specified font loader fails or is missing for this specific slot (display/body)
    const fallbackFont = Inter({
        subsets: defaultConf.subsets, // Use the original default (Inter's defaults)
        weight: defaultConf.weights,   // Use the original default (Inter's defaults)
        variable: defaultConf.variableName, // Use the original default (Inter's variable name)
        display: 'swap',
    });
    activeFontClasses.push(fallbackFont.variable);
    return fallbackFont;
  };

  loadFont(themeConfig.typography?.displayFont, defaultDisplayFontConfig);
  loadFont(themeConfig.typography?.bodyFont, defaultBodyFontConfig);

  return (
    <html lang="sl" suppressHydrationWarning className={activeFontClasses.join(' ')}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />

        {/* Tenant-specific color styles from R2 */}
        {tenantCSS && (
          <style
            id={`tenant-styles-${tenantSlug}`}
            dangerouslySetInnerHTML={{ __html: tenantCSS }}
          />
        )}
        {/* next/font automatically injects its <style> tags for font definitions */}
      </head>
      <body
        className={`tenant-${tenantSlug}`}
        data-tenant={tenantSlug}
        data-tenant-status={useFallbackStyles && !tenantCSS ? 'global-fallback' : useFallbackStyles ? 'r2-default-fallback' : 'active-css'}
      >
        <AdminBar adminBarProps={{ preview: isDraftMode }} />
        {children}
        {process.env.NODE_ENV !== 'production' && (
           <div style={{
                 position: 'fixed', bottom: '8px', right: '8px',
                 backgroundColor: 'rgba(0,0,0,0.75)', color: 'white',
                 padding: '4px 8px', fontSize: '10px', borderRadius: '4px', zIndex: 9999
               }}>
            Tenant: {tenantSlug}
            (CSS: {useFallbackStyles ? (tenantCSS ? 'Default' : 'Global Fallback') : 'Loaded'})
            Fonts: D: {displayFontSettings.name}, B: {bodyFontSettings.name}
          </div>
        )}
      </body>
    </html>
  );
}
```
**Action:** Carefully update `src/app/(frontend)/layout.tsx`. Import all Google Fonts you intend to support via `next/font/google` and add them to the `fontLoaders` map. Ensure error handling and fallbacks are robust. Ensure `S3_PUBLIC_ENDPOINT` (or your chosen env variable name) is set.

**Main CSS File (`globals.css`) and Tailwind Configuration:**

Your main CSS file (`globals.css`) and/or Tailwind config will define how the font CSS variables (which are ultimately supplied by `next/font/google` via the CSS variables assigned to the `<html>` tag, and then referenced by the tenant-specific CSS for `--font-family-display` and `--font-family-body`) are used.

**File:** `src/app/globals.css`
```css
/* src/app/globals.css */
@import "tailwindcss"; /* Tailwind v3/v4 import */

/* Define DEFAULT theme variables (Tailwind v4 @theme or CSS custom properties for v3) */
@theme { /* For Tailwind v4+ */
  --color-primary: oklch(49.12% 0.178 263.4); /* Default primary */
  --color-secondary: oklch(65.45% 0.121 142.8); /* Default secondary */
  --color-accent: oklch(0.77 0.1687 67.36); /* Default accent */

  /*
    Default font families. These will be overridden by tenant-specific CSS
    which uses variables like var(--font-display-tenant) / var(--font-body).
    Those variables, in turn, get their actual font stack from next/font.
  */
  --font-family-display: var(--font-display-tenant, 'Inter', system-ui, sans-serif);
  --font-family-body: var(--font-body, 'Inter', system-ui, sans-serif);
  /* Add other default theme variables */
}

/* For Tailwind v3, define global custom properties if not using @theme:
:root {
  --color-primary: oklch(49.12% 0.178 263.4);
  --color-secondary: oklch(65.45% 0.121 142.8);
  --color-accent: oklch(0.77 0.1687 67.36);
  --font-family-display: var(--font-display-tenant, 'Inter', system-ui, sans-serif);
  --font-family-body: var(--font-body, 'Inter', system-ui, sans-serif);
}
*/

/* Apply the fonts globally or through Tailwind utilities */
body {
  font-family: var(--font-family-body); /* Uses the variable chain */
}

h1, h2, h3, h4, h5, h6, .font-display { /* Example class for display font */
  font-family: var(--font-family-display); /* Uses the variable chain */
}

.font-body { /* Example class for body font */
    font-family: var(--font-family-body);
}
```

**File:** `tailwind.config.ts` (or `.js`)
```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/blocks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // These will use the CSS variables defined in @theme (via globals.css)
        // which are ultimately sourced from next/font variables.
        display: ['var(--font-family-display)'],
        body: ['var(--font-family-body)'],
      },
      colors: { // Example of how color variables would be used
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
      }
    },
  },
  plugins: [],
};
export default config;
```
**Action:** Update `globals.css` and `tailwind.config.ts`. Ensure your Tailwind utilities (e.g., `font-display`, `font-body`) correctly pick up these variables.

## Step 4: Cloudflare R2 Setup

*   Create an R2 bucket.
*   Configure public access (or use signed URLs/Cloudflare Workers for more control).
*   Set up CORS policies if accessing directly from the browser in some scenarios.
*   Obtain API credentials for Payload hook to upload files.

## Step 5: Tenant Identification Logic (Middleware)

*   The primary tenant identification logic should reside in `src/middleware.ts`.
*   Based on the incoming request (e.g., hostname), the middleware determines the `tenantSlug`.
*   **Crucially, the middleware must add the determined `tenantSlug` (or a default value like `'default'`) to the request headers, typically using a custom header like `X-Tenant-Slug`.**
    (Note: The existing middleware implementation is in `src/middleware.ts`)
    ```typescript
    // src/middleware.ts (Simplified Example)
    import { NextRequest, NextResponse } from 'next/server'

    export function middleware(req: NextRequest) {
      const hostname = req.headers.get('host') || '';
      const requestHeaders = new Headers(req.headers);
      let tenantSlug = 'default'; // Default slug

      // --- Add your logic to determine tenantSlug based on hostname --- 
      if (hostname === 'tenant1.example.com') {
        tenantSlug = 'tenant1';
      }
      // --- End logic ---

      requestHeaders.set('X-Tenant-Slug', tenantSlug); // Set the header

      // Continue processing (rewrite or next)
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
    ```
*   The `src/app/(frontend)/layout.tsx` component then simply reads this `X-Tenant-Slug` header using `headers()` from `next/headers` (as shown in Step 3).
*   This centralizes the identification logic and keeps the layout component clean.

## Step 6: Cache Management

*   **R2 Cache:** Set appropriate `Cache-Control` headers when uploading assets to R2.
    *   CSS files: `public, max-age=3600` (1 hour) is reasonable if using versioning.
    *   Font Config JSON (`tenant-configs/...json`): `public, max-age=300` (5 minutes) allows for quicker updates to font choices.
    *   Manifest & Version files (`manifest.json`, `versions.json`): `public, max-age=60` (1 minute) for frequent updates.
*   **Next.js Cache:**
    *   Utilize `fetch` revalidation (`next: { revalidate: seconds }`) for dynamic assets like CSS and font configs.
    *   Employ cache-busting query parameters (e.g., `?v=timestamp_or_version_hash`) for critical assets fetched by the client or server components, especially for the `versions.json` and the subsequent CSS/config calls.
*   **Cloudflare CDN Cache:** If Cloudflare CDN is in front of R2, configure cache rules there, or rely on R2's `Cache-Control` headers if passthrough is enabled.

## Tailwind CSS v4 Compatibility Notes

The overall strategy outlined in this plan is highly compatible with the principles and architecture of Tailwind CSS v4. Key points:

*   **Core Strategy Alignment:** Tailwind v4 heavily relies on CSS custom properties (variables) for its configuration and utility generation (e.g., exposing theme tokens like `--color-avocado-500`). Your plan's core logic of generating tenant-specific CSS variables (`--color-primary`, `--font-display`, etc.) fits perfectly with this CSS-variable-centric approach.
*   **CSS-First Configuration (`@theme`):** When migrating to v4, the *default* theme configuration (base colors, fonts, spacing scale defined in `tailwind.config.js` previously) will need to be moved into the `@theme { ... }` block within your main CSS file (`globals.css` or equivalent). The tenant-specific overrides generated by the Payload hook will still define variables on `:root`, effectively overriding the defaults set via `@theme`.
*   **Approach A (Build-Time Fetch) & v4:** This approach remains viable. Tailwind v4 includes built-in `@import` support, simplifying the build process slightly (no need for `postcss-import`). The base theme defined in `@theme` will be used during the build, and the imported tenant CSS files will override the corresponding variables at the `:root` level.
*   **Approach B (Dynamic Fetching) & v4:** This approach is an excellent fit and potentially preferable. It cleanly separates the base Tailwind build (using `@theme`) from the runtime application of tenant-specific styles. The injected `<style>` tag overrides the default CSS variables after the initial build, leveraging standard CSS mechanisms without interfering with Tailwind's build process.
*   **Payload Logic:** The fundamental logic in the Payload `afterChange` hook (fetching tenant data, generating CSS variables and font config JSON, uploading to R2) remains unchanged and correct for v4.
*   **Vercel Integration:** No significant changes required for Vercel deployment based on v4 compatibility itself. Approach A still requires a build script/redeploy for theme changes, while Approach B relies on Next.js fetch revalidation and cache-busting.

In summary, migrating this theming system to Tailwind CSS v4 primarily involves adapting the *default* theme configuration to use the `@theme` directive. Both proposed fetching strategies remain compatible, with Approach B offering a slightly cleaner separation from the build process.

## Considerations

*   **Tailwind v4 Migration:** Remember to move your default theme configuration from `tailwind.config.js` to the `@theme` block in your main CSS file when upgrading.
*   **Default Theme & Fonts:** Ensure a sensible default theme (colors and fonts like Inter) exists for unmatched tenants, errors, or during initial load.
*   **Error Handling:** Implement robust error handling for CSS and font config fetching, as well as for `next/font/google` loading. The examples include basic console warnings/errors; enhance as needed.
*   **Security:** Ensure R2 bucket permissions and API keys are secure. Validate tenant slugs and any inputs used in file paths.
*   **Font Availability & `fontLoaders` Map:**
    *   Ensure all fonts selected in Payload CMS are correctly imported in `layout.tsx` and mapped in `fontLoaders`.
    *   The keys in `fontLoaders` must exactly match the `value` stored for `typography.displayFont.name` and `typography.bodyFont.name` from Payload (e.g., "Open\_Sans" for "Open Sans").
    *   Handle cases where a font might not be available or if `next/font/google` fails to load it (fallbacks are implemented in the example `loadFont` function).
*   **Payload Hook Robustness:** Thoroughly test the `afterChange` hook in Payload to confirm CSS and JSON config files are correctly generated and uploaded to R2 upon tenant creation/update. Check logs for errors.
*   **R2 Cache Settings & `fetch` Revalidation:** Review and test cache settings for the CSS and `tenant-configs/${tenantSlug}.json` files in R2, and the `fetch` revalidation values in `layout.tsx`.
*   **Fallback Behavior:** Verify that default fonts and colors are applied correctly if a tenant's configuration is missing, invalid, or fails to load.
*   **Performance:** Monitor the performance impact. `next/font/google` is optimized, but fetching the config JSON adds a small network request. Ensure revalidation strategies are appropriate.
*   **Development Workflow:** For easier local development, consider if `getTenantThemeConfig` and `getTenantStyles` need a way to read local JSON/CSS files if R2 is not accessible or for faster iteration (e.g., by checking `process.env.NODE_ENV === 'development'`).
*   **Complexity:** The dynamic approach is flexible but involves server-side fetching. Ensure efficient caching.
*   **Payload Performance:** Ensure the `afterChange` hook is efficient. Offload asset generation to a background job/queue if it becomes too slow for direct HTTP responses from CMS operations.
*   **R2 Client:** Use the official AWS SDK v3 (`@aws-sdk/client-s3`) configured for the R2 endpoint, or a reliable R2 client library. Ensure it handles content types and cache control headers correctly.

This combined plan provides a comprehensive approach to integrating dynamic, tenant-specific theming including colors and Google Fonts. Remember to test each step thoroughly. 