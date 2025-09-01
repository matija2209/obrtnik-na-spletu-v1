# Feature Plan: Multi Custom Google Fonts with `next/font/google`

This plan outlines the steps to integrate tenant-specific custom Google Fonts into the existing multi theming architecture, leveraging `next/font/google` for optimized font loading in a Next.js application.

## Prerequisites

*   The base multi theming system (as outlined in `FEATURE_PLAN_TENANT_THEMING.md`) should be in place or implemented concurrently. This includes:
    *   `Tenant` collection in Payload CMS.
    *   CSS generation process via Payload hooks.
    *   Storage of tenant-specific CSS in Cloudflare R2.
    *   Middleware for tenant identification (`X-Slug` header).
    *   Dynamic CSS fetching in `src/app/(frontend)/layout.tsx`.

## Step 1: Update Tenant Configuration in Payload CMS

Modify the `Tenant` collection to store structured font preferences compatible with `next/font/google`.

**File:** Payload CMS `Tenants` collection definition (e.g., `src/collections/Tenants/index.ts`)

```javascript
// Payload CMS collection (Tenants)
export const Tenants = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    // ... existing fields (name, slug, colors) ...
    {
      name: 'typography',
      type: 'group',
      fields: [
        {
          name: 'headingFont',
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
    // ... other theme properties like logo override, etc.
  ],
  hooks: {
    // Ensure afterChange hook (from Step 2 of main theming plan) is updated
    afterChange: [ /* yourExistingAfterChangeHook, updatedTenantConfigHook */ ],
  }
};
```
**Action:** Update your `Tenants` collection definition. Regenerate Payload types (`pnpm payload generate:types`).

### Adding a New Supported Google Font

To add a new Google Font to the list of supported options for tenants, follow these steps:

1.  **Update `src/collections/Tenants/index.ts`**:
    *   In the `Tenants` collection definition, locate the `typography.headingFont.name` and `typography.bodyFont.name` fields.
    *   Add your new font to their `options` array. Ensure the `value` exactly matches the name you'll use to import from `next/font/google` (e.g., if the font is "My New Font", the value might be `My_New_Font`).
        ```javascript
        // Example for typography.headingFont.name.options:
        options: [
          { label: 'Inter', value: 'Inter' },
          { label: 'Roboto', value: 'Roboto' },
          { label: 'Open Sans', value: 'Open_Sans' },
          { label: 'Lato', value: 'Lato' },
          { label: 'Montserrat', value: 'Montserrat' },
          // ... other existing fonts ...
          { label: 'My New Font', value: 'My_New_Font' }, // <-- Add new font
        ],
        ```
    *   Repeat for `typography.bodyFont.name`.

2.  **Regenerate Payload Types**:
    *   Open your terminal and run the command:
        ```bash
        pnpm payload generate:types
        ```

3.  **Update Frontend Layout (`src/app/(frontend)/layout.tsx`)**:
    *   **Import the font:** Add an import statement at the top of the file:
        ```typescript
        import { /* ...existing fonts..., */ My_New_Font } from 'next/font/google';
        ```
    *   **Preload the font instance:** In the module scope (near other font definitions like `inter_font`), define a new constant for your font:
        ```typescript
        const my_new_font: NextFontWithVariable = My_New_Font({
          subsets: ['latin'], // Or other desired subsets
          weight: ['400', '700'], // Common weights
          variable: '--font-my_new_font-instance', // Unique CSS variable name
          display: 'swap',
        });
        ```
    *   **Update `SupportedFontName` type:** Add the font's string literal name to this type:
        ```typescript
        type SupportedFontName = 'Inter' | 'Roboto' | /* ... */ | 'My_New_Font';
        ```
    *   **Add to `preloadedFontInstances` map:** Map the font's name (as used in Payload CMS options) to its preloaded instance:
        ```typescript
        const preloadedFontInstances: Record<SupportedFontName, NextFontWithVariable> = {
          // ... existing fonts ...
          'My_New_Font': my_new_font,
        };
        ```

4.  **Update CSS Generator (`src/utilities/css-generator.ts`)**:
    *   Add an entry to the `actualFontInstanceVariables` map. This map links the font name (as used in Payload CMS) to the CSS variable you defined in `layout.tsx`:
        ```typescript
        const actualFontInstanceVariables: Record<string, string> = {
          // ... existing fonts ...
          'My_New_Font': '--font-my_new_font-instance',
        };
        ```

5.  **(Optional) Update Seed Data (`src/seed.ts`)**:
    *   If you use a seed script and want to use this new font for any seeded tenants, update the `typography` section in your `src/seed.ts` file accordingly, using the new font's name.

After completing these steps, your new Google Font will be available for selection in the Payload CMS, and the frontend will be able to load and apply it.

## Step 1.A: Update Seed Data (`src/seed.ts`)

If you have a seed script (e.g., `src/seed.ts`) that creates initial tenant data, you'll need to update it to match the new `typography` field structure in the Tenant collection.

**File:** `src/seed.ts` (or your equivalent seed file)

**Previous `typography` structure in seed data (example):**

```typescript
// Inside tenant creation data:
typography: {
  headingFont: 'Inter, system-ui, sans-serif',
  bodyFont: 'Inter, system-ui, sans-serif',
  headingWeight: '700',
  bodyWeight: '400',
},
```

**New `typography` structure in seed data (example):**

```typescript
// Inside tenant creation data:
typography: {
  headingFont: {
    name: 'Inter', // Or any other font name from your Payload select options
    weights: [{ weight: '700' }],
    variableName: '--font-heading-tenant', // Matches defaultValue in collection
    subsets: [{ subset: 'latin' }],
  },
  bodyFont: {
    name: 'Inter', // Or any other font name
    weights: [{ weight: '400' }],
    variableName: '--font-body-tenant', // Matches defaultValue in collection
    subsets: [{ subset: 'latin' }],
  },
},
```
**Action:** Update your seed script to use the new nested object structure for `typography.headingFont` and `typography.bodyFont`, including `name`, `weights`, `variableName`, and `subsets` fields.


## Step 3: Update Payload `afterChange` Hook

The `afterChange` hook for the `Tenants` collection needs to:
1.  Process the updated `typography` fields.
2.  **New**: Generate and upload a tenant-specific theme configuration JSON file to R2 (e.g., `tenant-configs/${tenantSlug}.json`). This file will be fetched by `RootLayout` to get the structured font data needed for `next/font/google`.

**File:** Payload hook file (e.g., `src/collections/Tenants/hooks/afterChange.ts` or `payload.config.ts`)

```typescript
// In your Payload config (e.g., payload.config.ts or a hook file)
import { CollectionAfterChangeHook, Payload } from 'payload';
import { r2 } from '@/lib/r2-client'; // (Exists at src/lib/r2-client.ts)
import { generateTenantCSS } from '@/utilities/css-generator'; // (Exists at src/utilities/css-generator.ts)
import type { Tenant } from 'payload-types';

// This function now handles both CSS and Theme Config JSON
async function processAndUploadTenantAssets(tenant: Tenant, payload: Payload) {
  const cssFileName = `tenant-styles/${tenant.slug}.css`;
  const configFileName = `tenant-configs/${tenant.slug}.json`; // New config file
  const manifestFileName = 'tenant-styles/manifest.json';
  const versionsFileName = 'tenant-styles/versions.json';

  try {
    payload.logger.info(`Processing assets for tenant ${tenant.slug}`);

    // 1. Generate and Upload CSS (existing logic, ensure generateTenantCSS is updated)
    const css = generateTenantCSS(tenant);
    const cssUploadResult = await r2.uploadFile(cssFileName, css, { /* ... R2 options ... */ });
    if (!cssUploadResult.success) {
      payload.logger.error(`Failed to upload CSS for ${tenant.slug}: ${cssUploadResult.error}`);
      // Decide if you want to stop or continue if CSS fails
    } else {
      payload.logger.info(`Successfully uploaded CSS for ${tenant.slug}.`);
    }

    // 2. Prepare and Upload Tenant Theme Configuration JSON (New)
    const themeConfig = {
      slug: tenant.slug,
      colors: tenant.colors, // Include colors if layout might need them, or just typography
      typography: {
        headingFont: tenant.typography?.headingFont ? {
          name: tenant.typography.headingFont.name,
          weights: tenant.typography.headingFont.weights?.map(w => w.weight),
          variableName: tenant.typography.headingFont.variableName,
          subsets: tenant.typography.headingFont.subsets?.map(s => s.subset),
        } : undefined,
        bodyFont: tenant.typography?.bodyFont ? {
          name: tenant.typography.bodyFont.name,
          weights: tenant.typography.bodyFont.weights?.map(w => w.weight),
          variableName: tenant.typography.bodyFont.variableName,
          subsets: tenant.typography.bodyFont.subsets?.map(s => s.subset),
        } : undefined,
      },
      // Add any other configurations the layout might need from the tenant
    };

    payload.logger.info(`Uploading theme config for tenant ${tenant.slug} to ${configFileName}`);
    const configUploadResult = await r2.uploadFile(configFileName, JSON.stringify(themeConfig, null, 2), {
      contentType: 'application/json',
      cacheControl: 'public, max-age=300', // Adjust cache as needed
    });
    if (!configUploadResult.success) {
      payload.logger.error(`Failed to upload theme config for ${tenant.slug}: ${configUploadResult.error}`);
    } else {
      payload.logger.info(`Successfully uploaded theme config for ${tenant.slug}.`);
    }

    // 3. Update Manifest and Version files (existing logic)
    // ... (ensure this logic is robust) ...

  } catch (error: any) {
    payload.logger.error(`Error processing assets for tenant ${tenant.slug}: ${error?.message || error}`);
  }
}

const afterChangeHook: CollectionAfterChangeHook<Tenant> = async ({ doc, req }) => {
  if (doc && doc.slug) {
    await processAndUploadTenantAssets(doc, req.payload);
  } else {
    req.payload.logger.warn(`Tenant document ${doc?.id} is missing required fields for asset generation.`);
  }
};

// Ensure this hook is added to your Tenants collection definition
// export const Tenants = { ... hooks: { afterChange: [afterChangeHook] } ... };
```
**Action:** Update the `afterChange` hook. Test thoroughly after a tenant's theme is saved.

## Step 4: Modify `RootLayout` for Dynamic Font Loading

The `RootLayout` will fetch the tenant's theme configuration JSON (which includes font details) from R2, then use `next/font/google` to load the specified fonts and apply their CSS variables.

**File:** `src/app/(frontend)/layout.tsx`

```tsx
import './globals.css'; // Contains base Tailwind import and DEFAULT @theme definitions
import { headers, draftMode } from 'next/headers';
import { AdminBar } from '@/components/admin/admin-bar'; // Assuming this component exists
import React from 'react';
import type { NextFont } from 'next/dist/compiled/@next/font';

// Import all Google fonts you plan to support by their 'next/font/google' names
import { Inter, Roboto, Open_Sans, Lato, Montserrat } from 'next/font/google';
// Add other fonts as needed, matching the 'name' in Payload options

const S3_ENDPOINT = process.env.S3_ENDPOINT; // Your R2 public endpoint

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
    headingFont?: FontConfigPayload;
    bodyFont?: FontConfigPayload;
  };
  // other config from JSON if needed
}

// Default font configurations (used as fallback)
const defaultHeadingFontConfig: Required<FontConfigPayload> = {
  name: 'Inter',
  weights: ['700'],
  variableName: '--font-heading-tenant',
  subsets: ['latin'],
};
const defaultBodyFontConfig: Required<FontConfigPayload> = {
  name: 'Inter',
  weights: ['400'],
  variableName: '--font-body-tenant',
  subsets: ['latin'],
};

async function getTenantThemeConfig(tenantSlug: string): Promise<TenantThemeConfig> {
  if (!S3_ENDPOINT) {
    console.warn("S3_ENDPOINT not set. Using default theme config for fonts.");
    return { typography: { headingFont: defaultHeadingFontConfig, bodyFont: defaultBodyFontConfig } };
  }
  try {
    const configUrl = `${S3_ENDPOINT}/tenant-configs/${tenantSlug}.json?v=${Date.now()}`; // Cache bust for dev
    const res = await fetch(configUrl, { next: { revalidate: 300 } }); // Revalidate every 5 mins

    if (!res.ok) {
      console.warn(`Failed to fetch theme config for ${tenantSlug} (${res.status}). Using defaults.`);
      if (tenantSlug !== 'default') { // Try fetching 'default' tenant config as a broader fallback
        const defaultConfigUrl = `${S3_ENDPOINT}/tenant-configs/default.json?v=${Date.now()}`;
        const defaultRes = await fetch(defaultConfigUrl, { next: { revalidate: 300 } });
        if (defaultRes.ok) return (await defaultRes.json()) as TenantThemeConfig;
      }
      return { typography: { headingFont: defaultHeadingFontConfig, bodyFont: defaultBodyFontConfig } };
    }
    return (await res.json()) as TenantThemeConfig;
  } catch (error) {
    console.error(`Error fetching theme config for ${tenantSlug}:`, error);
    return { typography: { headingFont: defaultHeadingFontConfig, bodyFont: defaultBodyFontConfig } };
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  'use server'; // For Next.js 13+ App Router with async components

  const { isEnabled: isDraftMode } = draftMode();
  const headersList = headers();
  const tenantSlug = headersList.get('X-Slug') || 'default';

  // --- Fetch Tenant-Specific Styles (Colors, etc. - from main theming plan) ---
  let tenantCSS = '';


  // --- Tenant Font Loading ---
  const themeConfig = await getTenantThemeConfig(tenantSlug);

  const headingFontSettings = themeConfig.typography?.headingFont || defaultHeadingFontConfig;
  const bodyFontSettings = themeConfig.typography?.bodyFont || defaultBodyFontConfig;

  const activeFontClasses: string[] = [];
  let loadedHeadingFontStyles = {}; // For inline style if needed, not typical with `variable`
  let loadedBodyFontStyles = {};

  const loadFont = (config: Required<FontConfigPayload>, defaultConf: Required<FontConfigPayload>) => {
    const fontLoader = fontLoaders[config.name || defaultConf.name];
    const chosenConfig = config.name ? config : defaultConf; // Use specific or default

    if (fontLoader) {
      try {
        const font = fontLoader({
          subsets: chosenConfig.subsets?.length ? chosenConfig.subsets : defaultConf.subsets,
          weight: chosenConfig.weights?.length ? chosenConfig.weights : defaultConf.weights,

          display: 'swap',
        });
        activeFontClasses.push(font.variable); // Add the CSS variable class to html
        // If not using `variable` and preferring `className` directly (less flexible for theming):
        // activeFontClasses.push(font.className);
        // loadedFontStyles = font.style; // Contains font-family, font-weight etc.
        return font;
      } catch (e) {
        console.error(`Error loading font ${chosenConfig.name}: `, e);
      }
    }
    console.warn(`Font loader for "${chosenConfig.name}" not found. Using fallback Inter.`);
    // Fallback to Inter if specified font loader fails or is missing
    const fallbackFont = Inter({
        subsets: defaultConf.subsets,
        weight: defaultConf.weights,

        display: 'swap',
    });
    activeFontClasses.push(fallbackFont.variable);
    return fallbackFont;
  };

  loadFont(headingFontSettings as Required<FontConfigPayload>, defaultHeadingFontConfig);
  loadFont(bodyFontSettings as Required<FontConfigPayload>, defaultBodyFontConfig);
  // --- End Tenant Font Loading ---

  return (
    <html lang="sl" suppressHydrationWarning className={activeFontClasses.join(' ')}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Add Favicons, etc. */}
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />

        {/* Tenant-specific non-font styles from R2 */}
        {tenantCSS && (
          <style
            id={`tenant-styles-${tenantSlug}`}
            dangerouslySetInnerHTML={{ __html: tenantCSS }}
          />
        )}
        {/* next/font automatically injects its <style> tags for font definitions */}
      </head>
      <body
        className={`tenant-${tenantSlug}`} // Applies theme (colors from tenantCSS)
        data={tenantSlug}
        // data-status={useFallbackStyles && !tenantCSS ? 'global-fallback' : useFallbackStyles ? 'r2-default-fallback' : 'active'}
      >
        <AdminBar adminBarProps={{ preview: isDraftMode }} />
        {children}
        {process.env.NODE_ENV !== 'production' && (
           <div style={{ /* Basic inline styles for visibility */
                 position: 'fixed', bottom: '8px', right: '8px',
                 backgroundColor: 'rgba(0,0,0,0.75)', color: 'white',
                 padding: '4px 8px', fontSize: '10px', borderRadius: '4px', zIndex: 9999
               }}>
            Tenant: {tenantSlug}
            {/* (CSS: {useFallbackStyles ? 'Fallback/Default' : 'Loaded'}) */}
            Fonts: D: {headingFontSettings.name}, B: {bodyFontSettings.name}
          </div>
        )}
      </body>
    </html>
  );
}
```
**Action:** Carefully update `src/app/(frontend)/layout.tsx`. Import all Google Fonts you intend to support via `next/font/google` and add them to the `fontLoaders` map. Ensure error handling and fallbacks are robust.


**Action:** Update `globals.css` and `tailwind.config.ts`. Ensure your Tailwind utilities (e.g., `font-heading`, `font-body`) correctly pick up these variables.

## Step 5: Testing and Considerations

*   **Font Availability:** Ensure all fonts selected in Payload CMS are correctly imported in `layout.tsx` and mapped in `fontLoaders`. Handle cases where a font might not be available or if `next/font/google` fails to load it.
*   **Payload Hook Robustness:** Thoroughly test the `afterChange` hook in Payload to confirm CSS and JSON config files are correctly generated and uploaded to R2 upon tenant creation/update.
*   **R2 Cache Settings:** Review cache settings for the new `tenant-configs/${tenantSlug}.json` files in R2 and for the `fetch` calls in `layout.tsx`.
*   **Fallback Behavior:** Verify that default fonts are applied correctly if a tenant's configuration is missing, invalid, or fails to load.
*   **Performance:** Monitor the performance impact. `next/font/google` is optimized, but fetching the config JSON adds a small overhead. Ensure revalidation strategies are appropriate.
*   **Development Workflow:** For easier local development, consider if the `getTenantThemeConfig` function needs a way to read local JSON files if R2 is not accessible or for faster iteration.
*   **Error Logging:** Enhance client-side and server-side logging for font loading and config fetching issues.

This plan provides a comprehensive approach to integrating dynamic, tenant-specific Google Fonts. Remember to test each step thoroughly. 