# Feature Plan: Multi-Tenant Theming

## Architecture Overview

*   Store tenant configurations in Payload CMS.
*   Generate and store CSS files in Cloudflare R2.
*   Build-time fetch for known tenants.
*   Optional runtime fetch for new tenants added between deployments.

## Step 1: Set Up Tenant Configuration in Payload CMS

Create a `Tenant` collection in Payload CMS:

```javascript
// Payload CMS collection
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
          // Example using OKLCH, but could be hex, rgb, etc.
          defaultValue: 'oklch(49.12% 0.178 263.4)', 
        },
        {
          name: 'secondary',
          type: 'text',
          defaultValue: 'oklch(65.45% 0.121 142.8)',
        },
        {
          name: 'accent', // Add accent color
          type: 'text',
          defaultValue: 'oklch(0.77 0.1687 67.36)', // Default from globals.css
        },
        // Add more color variables as needed (e.g., background, text)
      ],
    },
    {
      name: 'typography',
      type: 'group',
      fields: [
        {
          name: 'displayFont',
          type: 'text',
          defaultValue: 'Inter, sans-serif', // Ensure font is available/loaded
        },
        {
          name: 'bodyFont',
          type: 'text',
          defaultValue: 'Inter, sans-serif',
        },
        // More typography variables (e.g., font weights, sizes)
      ],
    },
    // Other theme properties like logo override, etc.
  ],
};
```

## Step 2: Create a CSS Generation Process

Add a hook to Payload that generates CSS when a tenant's theme settings are created or updated. This CSS should be stored in Cloudflare R2.

```javascript
// In your Payload config (e.g., payload.config.ts or a hook file)
import { CollectionAfterChangeHook, Payload } from 'payload';
// Import the R2 client instance
import { r2 } from '@/lib/r2-client'; // (Exists at src/lib/r2-client.ts)
// Import the CSS generator utility
import { generateTenantCSS } from '@/utilities/css-generator'; // (Exists at src/utilities/css-generator.ts)
import type { Tenant } from 'payload-types'; // Assuming generated types

const afterChangeHook: CollectionAfterChangeHook<Tenant> = async ({ doc, req }) => {
  // Check if the document has the necessary properties (basic type guard)
  // The generateTenantCSS function also includes checks, but this prevents unnecessary hook execution
  if (doc && doc.slug) { 
    await processAndUploadTenantCSS(doc, req.payload);
  } else {
     req.payload.logger.warn(`Tenant document ${doc?.id} is missing required fields for CSS generation.`);
  }
};

// Add the hook to your Tenants collection definition
// export const Tenants = { ... hooks: { afterChange: [afterChangeHook] } ... };

// CSS processing and upload function
async function processAndUploadTenantCSS(tenant: Tenant, payload: Payload) {
  const cssFileName = `tenant-styles/${tenant.slug}.css`;
  const manifestFileName = 'tenant-styles/manifest.json';
  const versionsFileName = 'tenant-styles/versions.json'; // For cache busting

  try {
    // 1. Generate CSS using the utility function
    payload.logger.info(`Generating CSS for tenant ${tenant.slug}`);
    const css = generateTenantCSS(tenant); 
    // Note: generateTenantCSS will throw an error if tenant is invalid

    // 2. Upload CSS to Cloudflare R2 using the client
    payload.logger.info(`Uploading CSS for tenant ${tenant.slug} to ${cssFileName}`);
    const cssUploadResult = await r2.uploadFile(cssFileName, css, {
      contentType: 'text/css',
      // Shorter cache, rely on versioning or dynamic fetching revalidation
      cacheControl: 'public, max-age=3600', // 1 hour cache
    });
    
    if (!cssUploadResult.success) {
        payload.logger.error(`Failed to upload CSS for ${tenant.slug}: ${cssUploadResult.error}`);
        return; // Stop processing if CSS upload fails
    }
    payload.logger.info(`Successfully uploaded CSS for ${tenant.slug}. URL: ${cssUploadResult.url}`);

    // 3. Update Manifest and Version files
    payload.logger.info('Updating manifest and version files...');
    const allTenantsResult = await payload.find({
      collection: 'tenants',
      limit: 1000, 
      depth: 0, 
      overrideAccess: false,
    });
    
    const tenantIds = allTenantsResult.docs.map(t => t.slug);
    const manifestUploadResult = await r2.uploadFile(manifestFileName, JSON.stringify(tenantIds), {
      contentType: 'application/json',
      cacheControl: 'public, max-age=60', 
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
        if (typeof versions !== 'object' || versions === null) {
             payload.logger.warn('Versions file content is not a valid object. Resetting.');
             versions = {};
        }
    } catch (e: any) {
        if (e.message?.includes('NoSuchKey') || e.message?.includes('not found')) { 
             payload.logger.info('Versions file not found, creating new one.');
        } else {
             payload.logger.error(`Error fetching or parsing versions file: ${e.message}`);
        }
        versions = {}; 
    }
    
    versions[tenant.slug] = Date.now(); 
    const versionsUploadResult = await r2.uploadFile(versionsFileName, JSON.stringify(versions), {
        contentType: 'application/json',
        cacheControl: 'public, max-age=60',
    });

    if (!versionsUploadResult.success) {
        payload.logger.error(`Failed to upload versions file: ${versionsUploadResult.error}`);
    } else {
         payload.logger.info('Versions file updated.');
    }

    // 4. Optional: Trigger Vercel Redeploy (if using build-time approach)
    // Consider if this is necessary or if dynamic fetching is sufficient
    // await triggerVercelDeploy(); 

  } catch (error: any) { 
    // Catch errors from generateTenantCSS or payload.find etc.
    payload.logger.error(`Error processing CSS for tenant ${tenant.slug}: ${error?.message || error}`);
  }
}
```
**Note:** Remember that for this code to work correctly, you first need to update your `Tenant` collection definition in Payload CMS to include the necessary theme fields (`colors`, `typography`, etc.) and then regenerate your types using `pnpm payload generate:types`.

## Step 3: Fetching and Applying Tenant Styles (Choose One Approach)

### Approach A: Build-Time Fetch (Less Dynamic)

1.  **Create Build Script:** Fetch all tenant CSS files from R2 during the Vercel build process.

    ```javascript
    // scripts/fetch-tenant-css.js
    const fs = require('fs');
    const path = require('path');
    const fetch = require('node-fetch'); // Or use native fetch in Node 18+
    
    // Replace with your R2 public URL or use SDK
    const R2_BUCKET_URL = process.env.S3_ENDPOINT; // Use environment variable
    
    async function fetchTenantCSS() {
      const stylesDir = path.resolve(__dirname, '../src/styles/tenants'); 
      const indexFile = path.resolve(__dirname, '../src/styles/tenant-styles.css');
      
      if (!fs.existsSync(stylesDir)){
        fs.mkdirSync(stylesDir, { recursive: true });
      }
      
      let importStatements = '/* Auto-generated tenant styles */
';
      
      try {
        // Fetch tenant manifest from R2
        console.log('Fetching tenant manifest...');
        const manifestUrl = `${R2_BUCKET_URL}/tenant-styles/manifest.json`;
        const manifestResponse = await fetch(manifestUrl);
        if (!manifestResponse.ok) throw new Error(`Failed to fetch manifest: ${manifestResponse.status}`);
        const tenantIds = await manifestResponse.json();
        console.log(`Found ${tenantIds.length} tenants in manifest.`);
        
        // Fetch CSS for each tenant
        for (const tenantId of tenantIds) {
          console.log(`Fetching CSS for tenant: ${tenantId}`);
          const cssUrl = `${R2_BUCKET_URL}/tenant-styles/${tenantId}.css`;
          const cssResponse = await fetch(cssUrl);
          if (!cssResponse.ok) {
             console.warn(`Skipping CSS for ${tenantId}: ${cssResponse.status}`);
             continue; 
          }
          const css = await cssResponse.text();
          
          const cssFilePath = path.join(stylesDir, `${tenantId}.css`);
          fs.writeFileSync(cssFilePath, css);
          importStatements += `@import "./tenants/${tenantId}.css";
`;
        }
        
        // Create index file importing all tenant styles
        fs.writeFileSync(indexFile, importStatements);
        console.log(`Tenant CSS index created at ${indexFile}`);
        
      } catch (error) {
        console.error('Error fetching tenant CSS:', error);
        // Decide if build should fail or continue with potentially stale/missing CSS
        // process.exit(1); 
      }
    }
    
    fetchTenantCSS();
    ```

2.  **Update `package.json`:** Run the script before `next build`.

    ```json
    {
      "scripts": {
        "fetch-styles": "node scripts/fetch-tenant-css.js",
        "build": "npm run fetch-styles && next build"
        // Or yarn equivalent
      }
    }
    ```
    *(Tailwind CSS v4 includes built-in `@import` support, potentially simplifying this by removing the need for external plugins like `postcss-import` if used previously).* 

3.  **Import in Main CSS File (e.g., `globals.css`):**

    ```css
    /* src/app/globals.css or equivalent */
    @import "tailwindcss"; /* Use the v4 import */

    /* Define DEFAULT theme variables using v4's @theme */
    @theme {
      --color-primary: oklch(49.12% 0.178 263.4); /* Default primary */
      --color-secondary: oklch(65.45% 0.121 142.8); /* Default secondary */
      --color-accent: oklch(0.77 0.1687 67.36); /* Default accent */
      --font-family-display: 'Inter', sans-serif;
      --font-family-body: 'Inter', sans-serif;
      /* Add other default theme variables */
    }

    /* Import the auto-generated index file containing tenant overrides */
    @import "./styles/tenant-styles.css"; 
    
    /* Other base styles if needed, though Tailwind v4 handles base/components/utilities via @import "tailwindcss" */
    ```
    This setup imports the base Tailwind styles and defines default theme variables using `@theme`. The `tenant-styles.css` file (generated by the build script) then imports individual tenant CSS files, which define the same variables on `:root`, overriding the defaults for specific tenants via the class applied in the layout.

4.  **Apply Tenant Class in Layout:** Read the tenant slug from the custom header set by the middleware and apply a class.

    (Note: Based on the existing file `src/app/(frontend)/layout.tsx`)
    ```jsx
    // src/app/(frontend)/layout.tsx
    import './globals.css'
    import { headers } from 'next/headers';
    import { draftMode } from 'next/headers';
    import { AdminBar } from '@/components/admin/admin-bar' // Assuming you have AdminBar
    
    export default async function RootLayout({ children }: { children: React.ReactNode }) {
      const { isEnabled } = await draftMode();
      const headersList = await headers();
      const tenantSlug = headersList.get('X-Tenant-Slug') || 'default'; // Read header set by middleware
      
      return (
        <html lang="en">
          <head>
            {/* Head elements */}
          </head>
          {/* Class applies CSS variables based on slug */}
          <body className={`tenant-${tenantSlug}`}> 
             {/* Optional: Render AdminBar if needed */}
             {isEnabled && <AdminBar adminBarProps={{ preview: true }} />} 
             {children}
          </body>
        </html>
      );
    }
    ```

**Pros:** CSS included in the main bundle, potentially faster initial load for known tenants.
**Cons:** Requires rebuild to see changes for *existing* tenants, doesn't handle tenants added *after* build without extra steps.

### Approach B: Dynamic CSS Fetching with Revalidation (Recommended for Real-Time Updates)

1.  **Modify Layout:** Fetch the specific tenant's CSS dynamically, handle versioning, fallback to default CSS, and add debug attributes.

    (Note: This reflects the logic in the existing file `src/app/(frontend)/layout.tsx`)
    ```jsx
    // src/app/(frontend)/layout.tsx
    import './globals.css' // Contains base Tailwind import and DEFAULT @theme definitions
    import { headers } from 'next/headers';
    import { draftMode } from 'next/headers';
    import { AdminBar } from '@/components/admin/admin-bar' // Assuming this component exists
    import React from 'react'

    // R2 public endpoint for tenant styles - Ensure this is set in your .env
    const S3_ENDPOINT = process.env.S3_ENDPOINT;

    export default async function RootLayout({ children }: { children: React.ReactNode }) {
      'use cache' // Opt into caching

      const { isEnabled } = await draftMode();
      const headersList = await headers();
      const tenantSlug = headersList.get('X-Tenant-Slug') || 'default';

      // Track if we're using default styles or tenant-specific styles
      let useFallbackStyles = false;
      let tenantCSS = '';
      let cssVersion = Date.now(); // Fallback version for cache busting
      
      // Check if R2 URL is configured
      if (!S3_ENDPOINT) {
        console.error("S3_ENDPOINT environment variable is not set. Cannot fetch tenant styles.");
        useFallbackStyles = true;
      } else {
        // First get versions info for cache busting
        try {
          const versionRes = await fetch(`${S3_ENDPOINT}/tenant-styles/versions.json`, {
            next: { revalidate: 60 }, // Check for new versions every minute
          });
          
          if (versionRes.ok) {
            const versions = await versionRes.json();
            cssVersion = versions[tenantSlug] || cssVersion;
          } else {
            console.warn(`Failed to fetch versions file: ${versionRes.status}. Proceeding without versioning.`);
          }
        } catch (e) {
          console.error('Error fetching tenant versions:', e);
        }

        // Fetch the specific tenant's CSS with version parameter for cache busting
        try {
          console.log(`Fetching CSS for tenant: ${tenantSlug} with version: ${cssVersion}`);
          const cssUrl = `${S3_ENDPOINT}/tenant-styles/${tenantSlug}.css?v=${cssVersion}`;
          const cssRes = await fetch(cssUrl, {
            next: { revalidate: 300 }, // Revalidate every 5 minutes as backup
          });

          if (cssRes.ok) {
            tenantCSS = await cssRes.text();
            console.log(`Successfully fetched CSS for tenant ${tenantSlug}`);
          } else {
            console.warn(`Failed to fetch CSS for tenant ${tenantSlug} (${cssRes.status}). Trying fallback to default.`);
            useFallbackStyles = true;
            
            // Try to fetch default tenant CSS if the requested one doesn't exist
            if (tenantSlug !== 'default') {
              try {
                // Use versioning for default CSS too, if available
                const defaultVersionRes = await fetch(`${S3_ENDPOINT}/tenant-styles/versions.json`, {
                    next: { revalidate: 60 }, 
                });
                let defaultCssVersion = Date.now();
                if(defaultVersionRes.ok) {
                    const defaultVersions = await defaultVersionRes.json();
                    defaultCssVersion = defaultVersions['default'] || defaultCssVersion;
                }

                const defaultCssRes = await fetch(`${S3_ENDPOINT}/tenant-styles/default.css?v=${defaultCssVersion}`, {
                  next: { revalidate: 300 },
                });
                
                if (defaultCssRes.ok) {
                  tenantCSS = await defaultCssRes.text();
                  console.log('Successfully fell back to default tenant CSS');
                } else {
                  console.warn(`Failed to fetch default CSS (${defaultCssRes.status}). Using global defaults.`);
                }
              } catch (fallbackError) {
                console.error('Error fetching default tenant CSS:', fallbackError);
              }
            } else {
              console.warn('Default tenant requested but CSS fetch failed. Using global defaults.');
            }
          }
        } catch (e) {
          console.error(`Error fetching tenant CSS for ${tenantSlug}:`, e);
          useFallbackStyles = true;
        }
      }

      return (
        // Assuming lang="sl" from previous version
        <html lang="sl" suppressHydrationWarning> 
          <head>
            {/* Basic Meta tags */}
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            {/* Add Favicons, etc. */}
            <link href="/favicon.ico" rel="icon" sizes="32x32" />
            <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
            
            {/* Apply tenant CSS if available */} 
            {tenantCSS && (
              <style 
                id={`tenant-styles-${tenantSlug}`} 
                dangerouslySetInnerHTML={{ __html: tenantCSS }} 
              />
            )}
            {/* No explicit fallback link needed - globals.css provides the base */}
          </head>
          
          {/* Add tenant ID as data attribute for debugging and custom targeting */} 
          <body 
            className={`tenant-${tenantSlug}`}
            data-tenant={tenantSlug}
            data-tenant-status={useFallbackStyles && !tenantCSS ? 'global-fallback' : useFallbackStyles ? 'r2-default-fallback' : 'active'}
          >
            {/* Optional admin bar for draft mode */} 
            <AdminBar
              adminBarProps={{
                preview: isEnabled,
              }}
            />
            
            {children}
            
            {/* Optional: Add a small indicator for development/staging environments */} 
            {process.env.NODE_ENV !== 'production' && (
               <div style={{ /* Basic inline styles for visibility */
                 position: 'fixed', bottom: '8px', right: '8px', 
                 backgroundColor: 'rgba(0,0,0,0.75)', color: 'white', 
                 padding: '4px 8px', fontSize: '10px', borderRadius: '4px', zIndex: 9999 
               }}> 
                Tenant: {tenantSlug} {useFallbackStyles && !tenantCSS ? '(Global Fallback)' : useFallbackStyles ? '(Default CSS)' : ''}
              </div>
            )}
          </body>
        </html>
      );
    }
    ```

2.  **No Build Script Needed:** The build process doesn't need to fetch CSS.
3.  **Main CSS File (e.g., `globals.css`):** 
    ```css
    /* src/app/globals.css or equivalent */
    @import "tailwindcss"; /* Use the v4 import */

    /* Define DEFAULT theme variables using v4's @theme */
    @theme {
      --color-primary: oklch(49.12% 0.178 263.4); /* Default primary */
      --color-secondary: oklch(65.45% 0.121 142.8); /* Default secondary */
      --color-accent: oklch(0.77 0.1687 67.36); /* Default accent */
      --font-family-display: 'Inter', sans-serif;
      --font-family-body: 'Inter', sans-serif;
      /* Add other default theme variables */
    }

    /* Only include truly global, non-theme-dependent styles here */
    ```
    In this approach, `globals.css` sets up Tailwind and defines the *default* theme using `@theme`. Tenant-specific overrides are fetched server-side and injected directly via the `<style>` tag in the layout, overriding the default CSS variables at runtime.

**Pros:** Updates reflected relatively quickly (controlled by `revalidate` and R2 cache), handles tenants added after build seamlessly. Aligns well with separating build-time configuration (`@theme`) from runtime overrides.
**Cons:** Small delay on first load for a user as CSS is fetched server-side, relies on Next.js caching/revalidation behavior.

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

*   **R2 Cache:** Set appropriate `Cache-Control` headers when uploading CSS to R2. Shorter cache if relying on dynamic fetching revalidation, potentially longer if using versioning.
*   **Next.js Cache:** Understand `fetch` revalidation (`next: { revalidate: seconds }`) or opt-out (`cache: 'no-store'`) if needed. Versioning (`?v=timestamp`) is generally the most reliable way to bust caches.
*   **Cloudflare CDN Cache:** If using Cloudflare's CDN in front of R2, configure cache rules there as well, or use cache purging API (more complex).

## Tailwind CSS v4 Compatibility Notes (Added based on review)

The overall strategy outlined in this plan is highly compatible with the principles and architecture of Tailwind CSS v4. Key points:

*   **Core Strategy Alignment:** Tailwind v4 heavily relies on CSS custom properties (variables) for its configuration and utility generation (e.g., exposing theme tokens like `--color-avocado-500`). Your plan's core logic of generating tenant-specific CSS variables (`--color-primary`, `--font-display`, etc.) fits perfectly with this CSS-variable-centric approach.
*   **CSS-First Configuration (`@theme`):** When migrating to v4, the *default* theme configuration (base colors, fonts, spacing scale defined in `tailwind.config.js` previously) will need to be moved into the `@theme { ... }` block within your main CSS file (`globals.css` or equivalent). The tenant-specific overrides generated by the Payload hook will still define variables on `:root`, effectively overriding the defaults set via `@theme`.
*   **Approach A (Build-Time Fetch) & v4:** This approach remains viable. Tailwind v4 includes built-in `@import` support, simplifying the build process slightly (no need for `postcss-import`). The base theme defined in `@theme` will be used during the build, and the imported tenant CSS files will override the corresponding variables at the `:root` level.
*   **Approach B (Dynamic Fetching) & v4:** This approach is an excellent fit and potentially preferable. It cleanly separates the base Tailwind build (using `@theme`) from the runtime application of tenant-specific styles. The injected `<style>` tag overrides the default CSS variables after the initial build, leveraging standard CSS mechanisms without interfering with Tailwind's build process.
*   **Payload Logic:** The fundamental logic in the Payload `afterChange` hook (fetching tenant data, generating CSS variables, uploading to R2) remains unchanged and correct for v4.
*   **Vercel Integration:** No significant changes required for Vercel deployment based on v4 compatibility itself. Approach A still requires a build script/redeploy for theme changes, while Approach B relies on Next.js fetch revalidation and cache-busting.

In summary, migrating this theming system to Tailwind CSS v4 primarily involves adapting the *default* theme configuration to use the `@theme` directive. Both proposed fetching strategies remain compatible, with Approach B offering a slightly cleaner separation from the build process.

## Considerations

*   **Tailwind v4 Migration:** Remember to move your default theme configuration from `tailwind.config.js` to the `@theme` block in your main CSS file when upgrading.
*   **Default Theme:** Ensure a sensible default theme exists for unmatched tenants or errors.
*   **Error Handling:** Implement robust error handling for CSS fetching and generation.
*   **Security:** Ensure R2 bucket permissions and API keys are secure. Validate tenant slugs.
*   **Font Loading:** If tenants can specify custom fonts, ensure those fonts are loaded efficiently (e.g., via `<link rel="preload">` or font loading strategies).
*   **Complexity:** The dynamic approach (B) is generally more flexible for real-time updates but involves server-side fetching per request (though cached by Next.js). The build-time approach (A) is simpler initially but less dynamic.
*   **Payload Performance:** Ensure the `afterChange` hook is efficient and doesn't significantly slow down CMS operations. Consider offloading CSS generation to a background job if it becomes complex.
*   **R2 Client:** Use the official AWS SDK v3 (`@aws-sdk/client-s3`) configured for the R2 endpoint.

This plan outlines the core steps. You'll need to adapt the specifics (R2 client implementation, tenant ID logic, exact CSS variables) to your project's details. 