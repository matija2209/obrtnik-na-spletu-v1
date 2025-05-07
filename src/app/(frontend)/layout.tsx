import './globals.css'
import { headers, draftMode } from 'next/headers';
import { AdminBar } from '@/components/admin/admin-bar'
import React from 'react'

// Import all Google fonts you plan to support by their 'next/font/google' names
import { Inter, Roboto, Open_Sans, Lato, Montserrat } from 'next/font/google';
import type { NextFontWithVariable } from 'next/dist/compiled/@next/font'; // Import this type
import actualFontInstanceVariables from '@/utilities/fontMapping';

// R2 public endpoint for tenant styles - Ensure this is set in your .env
const S3_CSS_DOMAIN = process.env.S3_CSS_DOMAIN;

// --- BEGIN MODULE SCOPE FONT DEFINITIONS ---
// These MUST be const assignments at the module scope.
// Each uses a unique CSS variable that next/font will manage.
const inter_font_instance = Inter({
  subsets: ['latin'],
  weight: ['400', '700'], // Default weights, can be overridden by specific needs if necessary
  variable: '--font-inter-instance',
  display: 'swap',
}) as NextFontWithVariable;

const roboto_font_instance = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto-instance',
  display: 'swap',
}) as NextFontWithVariable;

const open_sans_font_instance = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-open_sans-instance',
  display: 'swap',
}) as NextFontWithVariable;

const lato_font_instance = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato-instance',
  display: 'swap',
}) as NextFontWithVariable;

const montserrat_font_instance = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-montserrat-instance',
  display: 'swap',
}) as NextFontWithVariable;

// Map of preloaded font instances. Keys should match 'name' from Payload options.
const preloadedFontInstances: Record<string, NextFontWithVariable> = {
  'Inter': inter_font_instance,
  'Roboto': roboto_font_instance,
  'Open_Sans': open_sans_font_instance, // Key matches Payload 'Open_Sans'
  'Lato': lato_font_instance,
  'Montserrat': montserrat_font_instance,
  // Add other supported fonts here, mapping their name to the instance
};
// --- END MODULE SCOPE FONT DEFINITIONS ---

// Define a more specific type for font subsets if possible, or use string[] and rely on runtime validation
type GoogleFontSubset = | "latin" | "cyrillic" | "cyrillic-ext" | "greek" | "greek-ext" | "latin-ext" | "vietnamese";

interface FontConfigPayload {
  name?: string;
  weights?: string[]; // Keep as string[] for flexibility, validation happens at usage
  variableName?: string; // Logical variable name (e.g., --font-heading), used by CSS generator
  subsets?: GoogleFontSubset[];
}

interface TenantThemeConfig {
  slug?: string;
  typography?: {
    headingFont?: FontConfigPayload;
    bodyFont?: FontConfigPayload;
  };
  // other config from JSON if needed
}

// Default font configurations
const defaultConfig: Required<TenantThemeConfig> = { // Make it Required for easier access
  slug: 'default',
  typography: {
    headingFont: {
      name: 'Inter',
      weights: ['700'], // Default weight for heading
      variableName: '--font-heading',
      subsets: ['latin'],
    },
    bodyFont: {
      name: 'Inter',
      weights: ['400'], // Default weight for body
      subsets: ['latin'],
      variableName: '--font-body',
    }
  }
};

async function getTenantThemeConfig(tenantSlug: string, isDraftMode: boolean = false): Promise<TenantThemeConfig> {
  if (!S3_CSS_DOMAIN) {
    console.warn("S3_CSS_DOMAIN not set. Using default theme config for fonts.");
    return defaultConfig;
  }
  
  try {
    // Corrected URL to fetch tenant-specific theme config JSON
    const configUrl = `${S3_CSS_DOMAIN}/tenant-configs/${tenantSlug}.json?v=${Date.now()}`; // Cache bust for dev
    const res = await fetch(configUrl, { 
      // Skip cache completely when in draft mode, otherwise revalidate every 5 mins
      next: isDraftMode ? { revalidate: 0 } : { revalidate: 300 },
      cache: isDraftMode ? 'no-store' : undefined
    });

    if (!res.ok) {
      console.warn(`Failed to fetch theme config for ${tenantSlug} from ${configUrl} (${res.status}). Trying default config.`);
      // Try fetching 'default' tenant config as a broader fallback
      if (tenantSlug !== 'default') {
        const defaultConfigUrl = `${S3_CSS_DOMAIN}/tenant-configs/default.json?v=${Date.now()}`; // Cache bust for dev
        const defaultRes = await fetch(defaultConfigUrl, { 
          next: isDraftMode ? { revalidate: 0 } : { revalidate: 300 },
          cache: isDraftMode ? 'no-store' : undefined
        });
        if (defaultRes.ok) {
          console.log(`Successfully fetched default theme config from ${defaultConfigUrl}`);
          return (await defaultRes.json()) as TenantThemeConfig;
        }
        console.warn(`Failed to fetch default theme config from ${defaultConfigUrl} (${defaultRes.status}). Using hardcoded defaults.`);
      }
      return defaultConfig;
    }
    console.log(`Successfully fetched theme config for ${tenantSlug} from ${configUrl}`);
    return (await res.json()) as TenantThemeConfig;
  } catch (error) {
    console.error(`Error fetching theme config for ${tenantSlug}:`, error);
    return defaultConfig;
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  'use server'; // Ensure server-side execution for Next.js app router

  const { isEnabled: isDraftMode } = await draftMode();
  const headersList = await headers();
  const tenantSlug = headersList.get('X-Tenant-Slug') || 'default';

  // Track if we're using default styles or tenant-specific styles
  let useFallbackStyles = false;
  let tenantCSS = '';
  let cssVersion = Date.now(); // Fallback version for cache busting
  
  // Check if R2 URL is configured
  if (!S3_CSS_DOMAIN) {
    console.error("S3_CSS_DOMAIN environment variable is not set. Cannot fetch tenant styles.");
    useFallbackStyles = true;
  } else {
    // First get versions info for cache busting
    try {
      const versionsUrl = `${S3_CSS_DOMAIN}/tenant-styles/versions.json?v=${isDraftMode ? Date.now() : cssVersion}`;
      // console.log('Fetching versions from:', versionsUrl); // Log the full URL
      const versionRes = await fetch(versionsUrl, {
        next: isDraftMode ? { revalidate: 0 } : { revalidate: 60 }, // No cache in draft mode
        cache: isDraftMode ? 'no-store' : undefined
      });
      
      if (versionRes.ok) {
        const versions = await versionRes.json();
        cssVersion = versions[tenantSlug] || cssVersion;
      } else {
        console.warn(`Failed to fetch versions file: ${versionRes.status}. Proceeding without versioning.`);
        // Not setting useFallbackStyles here, as CSS might still exist without versioning
      }
    } catch (e) {
      console.error('Error fetching tenant versions:', e);
       // Proceed without versioning
    }

    // Fetch the specific tenant's CSS with version parameter for cache busting
    try {
      // Log the tenant slug AGAIN just before constructing the CSS URL
      // console.log(`Tenant slug just before CSS fetch: ${tenantSlug}`); 
      const cssUrl = `${S3_CSS_DOMAIN}/tenant-styles/${tenantSlug}.css?v=${isDraftMode ? Date.now() : cssVersion}`;
      // console.log(`Fetching CSS from: ${cssUrl}`); // Log the full URL
      const cssRes = await fetch(cssUrl, {
        next: isDraftMode ? { revalidate: 0 } : { revalidate: 300 }, // No cache in draft mode
        cache: isDraftMode ? 'no-store' : undefined
      });

      if (cssRes.ok) {
        tenantCSS = await cssRes.text();
        // console.log(`Successfully fetched CSS for tenant ${tenantSlug}`);
      } else {
        console.warn(`Failed to fetch CSS for tenant ${tenantSlug} (${cssRes.status}). Trying fallback to default.`);
        useFallbackStyles = true;
        
        // Try to fetch default tenant CSS if the requested one doesn't exist
        if (tenantSlug !== 'default') {
          try {
             // Log the tenant slug during fallback attempt
             // console.log(`Attempting fallback for tenant: ${tenantSlug}`);
             const defaultVersionsUrl = `${S3_CSS_DOMAIN}/tenant-styles/versions.json?v=${isDraftMode ? Date.now() : ''}`;
             // console.log('Fetching default versions from:', defaultVersionsUrl); // Log URL
             const defaultVersionRes = await fetch(defaultVersionsUrl, {
                 next: isDraftMode ? { revalidate: 0 } : { revalidate: 60 },
                 cache: isDraftMode ? 'no-store' : undefined
             });
             let defaultCssVersion = Date.now();
             if(defaultVersionRes.ok) {
                 const defaultVersions = await defaultVersionRes.json();
                 defaultCssVersion = defaultVersions['default'] || defaultCssVersion;
             }

            const defaultCssUrl = `${S3_CSS_DOMAIN}/tenant-styles/default.css?v=${isDraftMode ? Date.now() : defaultCssVersion}`;
            // console.log('Fetching default CSS from:', defaultCssUrl); // Log URL
            const defaultCssRes = await fetch(defaultCssUrl, {
              next: isDraftMode ? { revalidate: 0 } : { revalidate: 300 },
              cache: isDraftMode ? 'no-store' : undefined
            });
            
            if (defaultCssRes.ok) {
              tenantCSS = await defaultCssRes.text();
              // console.log('Successfully fell back to default tenant CSS');
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

  // --- Tenant Font Loading ---
  const themeConfig = await getTenantThemeConfig(tenantSlug, isDraftMode);

  const activeFontClasses: string[] = [];

  // Get the configuration for heading and body fonts, falling back to defaults.
  const headingFontUserConfig = themeConfig.typography?.headingFont || defaultConfig.typography!.headingFont!;
  const bodyFontUserConfig = themeConfig.typography?.bodyFont || defaultConfig.typography!.bodyFont!;

  // Function to add font class if the font is found in preloaded instances
  const tenant_addFontClass = (fontConfig: Required<FontConfigPayload>) => {
    const fontName = fontConfig.name;
    const fontInstance = preloadedFontInstances[fontName];
    if (fontInstance) {
      if (fontInstance.variable && !activeFontClasses.includes(fontInstance.variable)) {
        activeFontClasses.push(fontInstance.variable);
      }
    } else {
      console.warn(`Font instance for "${fontName}" not found in preloadedFontInstances. Check configuration.`)
      // Fallback: attempt to load default font (Inter) if chosen one wasn't found
      const defaultInstance = preloadedFontInstances[defaultConfig.typography!.headingFont!.name!]; // or defaultBodyFontConfig.name
      if (defaultInstance && defaultInstance.variable && !activeFontClasses.includes(defaultInstance.variable)) {
        activeFontClasses.push(defaultInstance.variable);
      }
    }
  };

  tenant_addFontClass(headingFontUserConfig as Required<FontConfigPayload>); 
  tenant_addFontClass(bodyFontUserConfig as Required<FontConfigPayload>);
  // --- End Tenant Font Loading ---

  // For the debug display, use the names from the resolved config
  const headingFontSettingsForDebug = themeConfig.typography?.headingFont || defaultConfig.typography!.headingFont!;
  const bodyFontSettingsForDebug = themeConfig.typography?.bodyFont || defaultConfig.typography!.bodyFont!;

  return (
    <html lang="sl" suppressHydrationWarning className={activeFontClasses.join(' ')}> 
      <head>
        {/* Basic Meta tags */} 
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
            preview: isDraftMode,
            // You might want to pass the tenantSlug or status here too
          }}
        />
        
        {children}
        
        {/* Optional: Add a small indicator for development/staging environments */} 
        {process.env.NODE_ENV !== 'production' && (
          <div style={{ /* Basic inline styles for visibility */
             position: 'fixed', 
             bottom: '8px', 
             right: '8px', 
             backgroundColor: 'rgba(0,0,0,0.75)',
             color: 'white', 
             padding: '4px 8px', 
             fontSize: '10px', 
             borderRadius: '4px', 
             zIndex: 9999 
           }}> 
            Tenant: {tenantSlug} {useFallbackStyles && !tenantCSS ? '(Global Fallback)' : useFallbackStyles ? '(Default CSS)' : ''}
            Fonts: D: {headingFontSettingsForDebug.name}, B: {bodyFontSettingsForDebug.name}
          </div>
        )}
      </body>
    </html>
  );
}
