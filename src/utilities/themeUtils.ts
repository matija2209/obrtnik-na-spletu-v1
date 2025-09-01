import { unstable_cacheLife, unstable_cacheTag } from 'next/cache';
import type { NextFontWithVariable } from 'next/dist/compiled/@next/font';

// R2 public endpoint for design styles - Ensure this is set in your .env
const S3_CSS_DOMAIN = process.env.S3_CSS_DOMAIN;

// Define a more specific type for font subsets if possible, or use string[] and rely on runtime validation
export type GoogleFontSubset = | "latin" | "cyrillic" | "cyrillic-ext" | "greek" | "greek-ext" | "latin-ext" | "vietnamese";

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

// Default font configurations
export const defaultConfig: Required<DesignThemeConfig> = {
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
  },
  colors: {
    primary: 'oklch(0.82 0.1663 83.77)',
    primaryForeground: 'oklch(0.985 0 0)',
    secondary: 'oklch(0.32 0.1025 253.89)',
    secondaryForeground: 'oklch(0.98 0.005 0)',
    accent: 'oklch(0.77 0.1687 67.36)',
    accentForeground: 'oklch(0.205 0 0)',
    background: 'oklch(1 0 0)',
    foreground: 'oklch(0.145 0 0)',
  },
  radius: '0.625rem',
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