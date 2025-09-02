import './globals.css'
import { headers, draftMode } from 'next/headers';
import { AdminBar } from '@/components/admin/admin-bar'
import React, { Suspense } from 'react'

// Import all Google fonts you plan to support by their 'next/font/google' names
import { Inter, Roboto, Open_Sans, Lato, Montserrat } from 'next/font/google';
import type { NextFontWithVariable } from 'next/dist/compiled/@next/font'; // Import this type
import { getTenantThemeConfig, defaultConfig, type TenantThemeConfig, type FontConfigPayload, fetchTenantStyles, getTenantFontClasses } from '@/utilities/themeUtils';
import AnalyticsLoader from '@/components/analytics-loader';
import CookieConsent from '@/components/cookie-consent';
import FullScreenLoader from '@/components/common/FullScreenLoader';

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  'use server'; 
  const { isEnabled: isDraftMode } = await draftMode();
  const headersList = await headers();
  const tenantSlug = headersList.get('X-Tenant-Slug') || 'default';

  const { tenantCSS, useFallbackStyles } = await fetchTenantStyles(tenantSlug, isDraftMode);

  // --- Tenant Font Loading ---
  const themeConfig = await getTenantThemeConfig(tenantSlug, isDraftMode);

  const activeFontClasses = getTenantFontClasses(themeConfig, defaultConfig, preloadedFontInstances);
  // --- End Tenant Font Loading ---

  // For the debug display, use the names from the resolved config
  const headingFontSettingsForDebug = themeConfig.typography?.headingFont || defaultConfig.typography!.headingFont!;
  const bodyFontSettingsForDebug = themeConfig.typography?.bodyFont || defaultConfig.typography!.bodyFont!;

  return (
    <html lang="sl" suppressHydrationWarning className={activeFontClasses.join(' ')}> 
      <Suspense fallback={<FullScreenLoader />}>
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
      <AnalyticsLoader />
        <Suspense fallback={null}>
            <CookieConsent />
        </Suspense>
        </Suspense>
    </html>
  );
}