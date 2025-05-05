import './globals.css'
import { headers } from 'next/headers';
import { draftMode } from 'next/headers';
import { AdminBar } from '@/components/admin/admin-bar'
import React from 'react'

// R2 public endpoint for tenant styles - Ensure this is set in your .env
const S3_CSS_DOMAIN = process.env.S3_CSS_DOMAIN;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Log the S3_CSS_DOMAIN value immediately
  // console.log('S3_CSS_DOMAIN:', S3_CSS_DOMAIN);

  const { isEnabled } = await draftMode();
  const headersList = await headers();
  const tenantSlug = headersList.get('X-Tenant-Slug') || 'default';
  // Log the determined tenant slug
  // console.log('Determined tenantSlug:', tenantSlug);

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
      const versionsUrl = `${S3_CSS_DOMAIN}/tenant-styles/versions.json`;
      // console.log('Fetching versions from:', versionsUrl); // Log the full URL
      const versionRes = await fetch(versionsUrl, {
        next: { revalidate: 60 }, // Check for new versions every minute
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
      const cssUrl = `${S3_CSS_DOMAIN}/tenant-styles/${tenantSlug}.css?v=${cssVersion}`;
      // console.log(`Fetching CSS from: ${cssUrl}`); // Log the full URL
      const cssRes = await fetch(cssUrl, {
        next: { revalidate: 300 }, // Revalidate every 5 minutes as backup
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
             const defaultVersionsUrl = `${S3_CSS_DOMAIN}/tenant-styles/versions.json`;
             // console.log('Fetching default versions from:', defaultVersionsUrl); // Log URL
             const defaultVersionRes = await fetch(defaultVersionsUrl, {
                 next: { revalidate: 60 }, 
             });
             let defaultCssVersion = Date.now();
             if(defaultVersionRes.ok) {
                 const defaultVersions = await defaultVersionRes.json();
                 defaultCssVersion = defaultVersions['default'] || defaultCssVersion;
             }

            const defaultCssUrl = `${S3_CSS_DOMAIN}/tenant-styles/default.css?v=${defaultCssVersion}`;
            // console.log('Fetching default CSS from:', defaultCssUrl); // Log URL
            const defaultCssRes = await fetch(defaultCssUrl, {
              next: { revalidate: 300 },
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

  return (
    <html lang="sl" suppressHydrationWarning> 
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
            preview: isEnabled,
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
          </div>
        )}
      </body>
    </html>
  );
}
