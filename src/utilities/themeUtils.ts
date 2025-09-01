import { unstable_cacheLife, unstable_cacheTag } from 'next/cache';
import type { NextFontWithVariable } from 'next/dist/compiled/@next/font';

// R2 public endpoint for design styles - Ensure this is set in your .env
const S3_CSS_DOMAIN = process.env.S3_CSS_DOMAIN;

// Define a more specific type for font subsets if possible, or use string[] and rely on runtime validation
// Define a more specific type for font subsets if possible, or use string[] and rely on runtime validation
export type GoogleFontSubset = | "latin" | "cyrillic" | "cyrillic-ext" | "greek" | "greek-ext" | "latin-ext" | "vietnamese";

export interface FontConfigPayload {
  name?: string;
  weights?: string[]; // Keep as string[] for flexibility, validation happens at usage
  variableName?: string; // Logical variable name (e.g., --font-heading), used by CSS generator
  subsets?: GoogleFontSubset[];
}

export interface TenantThemeConfig {
  slug?: string;
  typography?: {
    headingFont?: FontConfigPayload;
    bodyFont?: FontConfigPayload;
  };
  // other config from JSON if needed
}

export interface FontConfigPayload {
  name?: string;
  weights?: string[]; // Keep as string[] for flexibility, validation happens at usage
  variableName?: string; // Logical variable name (e.g., --font-heading), used by CSS generator
  subsets?: GoogleFontSubset[];
}

export interface DesignThemeConfig {
  typography?: {
    headingFont?: FontConfigPayload;
    bodyFont?: FontConfigPayload;
  };
  colors?: {
    primary?: string;
    primaryForeground?: string;
    secondary?: string;
    secondaryForeground?: string;
    accent?: string;
    accentForeground?: string;
    background?: string;
    foreground?: string;
  };
  radius?: string;
}
export const defaultConfig: Required<TenantThemeConfig> = { // Make it Required for easier access
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

export const DESIGN_THEME_CONFIG_TAG = 'design-theme-config';

export async function getDesignThemeConfig(isDraftMode: boolean = false): Promise<DesignThemeConfig> {
  "use cache";
  // unstable_cacheLife("max")
  // unstable_cacheTag(DESIGN_THEME_CONFIG_TAG)
  if (!S3_CSS_DOMAIN) {
    console.warn("S3_CSS_DOMAIN not set. Using default theme config for fonts.");
    return defaultConfig;
  }
  
  try {
    // Fetch design-specific theme config JSON
    const configUrl = `${S3_CSS_DOMAIN}/design-configs/design.json?v=${Date.now()}`; // Cache bust for dev
    const res = await fetch(configUrl, {
      next: isDraftMode ? { revalidate: 0 } : { revalidate: 3600, tags: [DESIGN_THEME_CONFIG_TAG] },
      cache: isDraftMode ? 'no-store' : "force-cache",
    });

    if (!res.ok) {
      console.warn(`Failed to fetch design theme config from ${configUrl} (${res.status}). Using hardcoded defaults.`);
      return defaultConfig;
    }
    console.log(`Successfully fetched design theme config from ${configUrl}`);
    return (await res.json()) as DesignThemeConfig;
  } catch (error) {
    console.error(`Error fetching design theme config:`, error);
    return defaultConfig;
  }
}

export const DESIGN_CSS_TAG = 'design-css';

export async function fetchDesignStyles(
  isDraftMode: boolean,
): Promise<{ designCSS: string; useFallbackStyles: boolean }> {
  "use cache";
  unstable_cacheLife("max")
  unstable_cacheTag(DESIGN_CSS_TAG)

  let designCSS = '';
  let useFallbackStyles = false;
  let cssVersion = Date.now(); // Fallback version for cache busting

  if (!S3_CSS_DOMAIN) {
    console.error("S3_CSS_DOMAIN environment variable is not set. Cannot fetch design styles.");
    useFallbackStyles = true;
    return { designCSS, useFallbackStyles };
  }

  // First get versions info for cache busting
  try {
    const versionsUrl = `${S3_CSS_DOMAIN}/design-styles/versions.json?v=${isDraftMode ? Date.now() : cssVersion}`;
    const versionRes = await fetch(versionsUrl, {
      next: isDraftMode ? { revalidate: 0 } : { revalidate: 3600, tags: [DESIGN_CSS_TAG] },
      cache: isDraftMode ? 'no-store' : "force-cache",
    });

    if (versionRes.ok) {
      const versions = await versionRes.json();
      cssVersion = versions.design || cssVersion;
    } else {
      console.warn(`Failed to fetch versions file: ${versionRes.status}. Proceeding without versioning.`);
    }
  } catch (e) {
    console.error('Error fetching design versions:', e);
  }

  // Fetch the design CSS with version parameter for cache busting
  try {
    const cssUrl = `${S3_CSS_DOMAIN}/design-styles/design.css?v=${isDraftMode ? Date.now() : cssVersion}`;
    const cssRes = await fetch(cssUrl, {
      next: isDraftMode ? { revalidate: 0 } : { revalidate: 3600, tags: [DESIGN_CSS_TAG] },
      cache: isDraftMode ? 'no-store' : "force-cache",
    });

    if (cssRes.ok) {
      designCSS = await cssRes.text();
    } else {
      console.warn(`Failed to fetch design CSS (${cssRes.status}). Using global defaults.`);
      useFallbackStyles = true;
    }
  } catch (e) {
    console.error(`Error fetching design CSS:`, e);
    useFallbackStyles = true;
  }

  return { designCSS, useFallbackStyles };
}

export function getDesignFontClasses(
  themeConfig: DesignThemeConfig,
  defaultConfig: Required<DesignThemeConfig>,
  preloadedFontInstances: Record<string, NextFontWithVariable>
): string[] {
  const activeFontClasses: string[] = [];

  const headingFontUserConfig = themeConfig.typography?.headingFont || defaultConfig.typography!.headingFont!;
  const bodyFontUserConfig = themeConfig.typography?.bodyFont || defaultConfig.typography!.bodyFont!;

  const addFontClass = (fontConfig: Required<FontConfigPayload>) => {
    const fontName = fontConfig.name;
    const fontInstance = preloadedFontInstances[fontName];
    if (fontInstance) {
      if (fontInstance.variable && !activeFontClasses.includes(fontInstance.variable)) {
        activeFontClasses.push(fontInstance.variable);
      }
    } else {
      console.warn(`Font instance for "${fontName}" not found in preloadedFontInstances. Check configuration.`)
      const defaultInstance = preloadedFontInstances[defaultConfig.typography!.headingFont!.name!]; 
      if (defaultInstance && defaultInstance.variable && !activeFontClasses.includes(defaultInstance.variable)) {
        activeFontClasses.push(defaultInstance.variable);
      }
    }
  };

  addFontClass(headingFontUserConfig as Required<FontConfigPayload>); 
  addFontClass(bodyFontUserConfig as Required<FontConfigPayload>);

  return activeFontClasses;
} 

export const TENANT_THEME_CONFIG_TAG = (tenantSlug: string) => `tenant-theme-config-${tenantSlug}`;
export const TENANT_CSS_TAG = (tenantSlug: string) => `tenant-css-${tenantSlug}`;


export async function getTenantThemeConfig(tenantSlug: string, isDraftMode: boolean = false): Promise<TenantThemeConfig> {
  "use cache";
  // unstable_cacheLife("max")
  // unstable_cacheTag(TENANT_THEME_CONFIG_TAG(tenantSlug))
  if (!S3_CSS_DOMAIN) {
    console.warn("S3_CSS_DOMAIN not set. Using default theme config for fonts.");
    return defaultConfig;
  }
  
  try {
    // Corrected URL to fetch tenant-specific theme config JSON
    const configUrl = `${S3_CSS_DOMAIN}/tenant-configs/${tenantSlug}.json?v=${Date.now()}`; // Cache bust for dev
    const res = await fetch(configUrl, {
      next: isDraftMode ? { revalidate: 0 } : { revalidate: 3600,tags: [TENANT_THEME_CONFIG_TAG(tenantSlug)] },
      cache: isDraftMode ? 'no-store' : "force-cache",
    });

    if (!res.ok) {
      console.warn(`Failed to fetch theme config for ${tenantSlug} from ${configUrl} (${res.status}). Trying default config.`);
      // Try fetching 'default' tenant config as a broader fallback
      if (tenantSlug !== 'default') {
        const defaultConfigUrl = `${S3_CSS_DOMAIN}/tenant-configs/default.json?v=${Date.now()}`; // Cache bust for dev
        const defaultRes = await fetch(defaultConfigUrl, {
          next: isDraftMode ? { revalidate: 0 } : { revalidate: 3600,tags: [TENANT_THEME_CONFIG_TAG(tenantSlug)] },
          cache: isDraftMode ? 'no-store' : "force-cache",
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



export async function fetchTenantStyles(
  tenantSlug: string, 
  isDraftMode: boolean,
): Promise<{ tenantCSS: string; useFallbackStyles: boolean }> {
  "use cache";
  unstable_cacheLife("max")
  unstable_cacheTag(TENANT_CSS_TAG(tenantSlug))

  let tenantCSS = '';
  let useFallbackStyles = false;
  let cssVersion = Date.now(); // Fallback version for cache busting

  if (!S3_CSS_DOMAIN) {
    console.error("S3_CSS_DOMAIN environment variable is not set. Cannot fetch tenant styles.");
    useFallbackStyles = true;
    return { tenantCSS, useFallbackStyles };
  }

  // First get versions info for cache busting
  try {
    const versionsUrl = `${S3_CSS_DOMAIN}/tenant-styles/versions.json?v=${isDraftMode ? Date.now() : cssVersion}`;
    const versionRes = await fetch(versionsUrl, {
      next: isDraftMode ? { revalidate: 0 } : { revalidate: 3600,tags: [TENANT_CSS_TAG(tenantSlug)] },
      cache: isDraftMode ? 'no-store' : "force-cache",
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
    const cssUrl = `${S3_CSS_DOMAIN}/tenant-styles/${tenantSlug}.css?v=${isDraftMode ? Date.now() : cssVersion}`;
    const cssRes = await fetch(cssUrl, {
      next: isDraftMode ? { revalidate: 0 } : { revalidate: 3600,tags: [TENANT_CSS_TAG(tenantSlug)] },
      cache: isDraftMode ? 'no-store' : "force-cache",
    });

    if (cssRes.ok) {
      tenantCSS = await cssRes.text();
    } else {
      console.warn(`Failed to fetch CSS for tenant ${tenantSlug} (${cssRes.status}). Trying fallback to default.`);
      useFallbackStyles = true;

      if (tenantSlug !== 'default') {
        try {
          const defaultVersionsUrl = `${S3_CSS_DOMAIN}/tenant-styles/versions.json?v=${isDraftMode ? Date.now() : ''}`;
          const defaultVersionRes = await fetch(defaultVersionsUrl, {
            next: isDraftMode ? { revalidate: 0 } : { revalidate: 3600,tags: [TENANT_CSS_TAG(tenantSlug)] },
            cache: isDraftMode ? 'no-store' : "force-cache",
          });
          let defaultCssVersion = Date.now();
          if (defaultVersionRes.ok) {
            const defaultVersions = await defaultVersionRes.json();
            defaultCssVersion = defaultVersions['default'] || defaultCssVersion;
          }

          const defaultCssUrl = `${S3_CSS_DOMAIN}/tenant-styles/default.css?v=${isDraftMode ? Date.now() : defaultCssVersion}`;
          const defaultCssRes = await fetch(defaultCssUrl, {
            next: isDraftMode ? { revalidate: 0 } : { revalidate: 3600,tags: [TENANT_CSS_TAG(tenantSlug)] },
            cache: isDraftMode ? 'no-store' : "force-cache",
          });

          if (defaultCssRes.ok) {
            tenantCSS = await defaultCssRes.text();
            // Successfully fell back to default tenant CSS, but useFallbackStyles remains true
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
    useFallbackStyles = true; // Ensure fallback is true if any error occurs in this block
  }

  return { tenantCSS, useFallbackStyles };
}



export function getTenantFontClasses(
  themeConfig: DesignThemeConfig,
  defaultConfig: Required<TenantThemeConfig>,
  preloadedFontInstances: Record<string, NextFontWithVariable>
): string[] {
  const activeFontClasses: string[] = [];

  const headingFontUserConfig = themeConfig.typography?.headingFont || defaultConfig.typography!.headingFont!;
  const bodyFontUserConfig = themeConfig.typography?.bodyFont || defaultConfig.typography!.bodyFont!;

  const addFontClass = (fontConfig: Required<FontConfigPayload>) => {
    const fontName = fontConfig.name;
    const fontInstance = preloadedFontInstances[fontName];
    if (fontInstance) {
      if (fontInstance.variable && !activeFontClasses.includes(fontInstance.variable)) {
        activeFontClasses.push(fontInstance.variable);
      }
    } else {
      console.warn(`Font instance for "${fontName}" not found in preloadedFontInstances. Check configuration.`)
      const defaultInstance = preloadedFontInstances[defaultConfig.typography!.headingFont!.name!]; 
      if (defaultInstance && defaultInstance.variable && !activeFontClasses.includes(defaultInstance.variable)) {
        activeFontClasses.push(defaultInstance.variable);
      }
    }
  };

  addFontClass(headingFontUserConfig as Required<FontConfigPayload>); 
  addFontClass(bodyFontUserConfig as Required<FontConfigPayload>);

  return activeFontClasses;
} 