import type { Tenant } from '../../payload-types'; // Corrected import path
import actualFontInstanceVariables from './fontMapping';

// Define default theme values
const defaults = {
    colors: {
      primary: 'oklch(49.12% 0.178 263.4)',
      secondary: 'oklch(65.45% 0.121 142.8)', 
      accent: 'oklch(0.77 0.1687 67.36)',
      background: 'oklch(100% 0 0)', // Example default
      text: 'oklch(0.25 0 0)',       // Example default
      primaryForeground: 'oklch(0.25 0 0)',
      secondaryForeground: 'oklch(0.25 0 0)',
      accentForeground: 'oklch(0.25 0 0)',
      foreground: 'oklch(0.25 0 0)',
    },
    // Typography defaults here are less critical now as next/font handles the stack
    // but could be used for non-next/font fallbacks if ever needed.
    typography: {
      headingFont: 'Inter, system-ui, sans-serif', 
      bodyFont: 'Inter, system-ui, sans-serif',
      headingWeight: '700',
      bodyWeight: '400',
    },
    // Add other theme categories like spacing if needed
    // spacing: {
    //   containerMaxWidth: '1200px',
    //   gapDefault: '1rem',
    // }
    radius: '0.25rem',
  };

/**
 * Generates CSS custom properties for a tenant theme.
 * Uses optional chaining and nullish coalescing for safe access and fallbacks.
 * 
 * @param {Tenant} tenant - The tenant object from Payload CMS.
 * @returns {string} - The generated CSS string.
 * @throws {Error} If the tenant object is invalid or missing a slug.
 */
export function generateTenantCSS(tenant: Tenant): string {
  // Validate tenant object minimally
  if (!tenant || !tenant.slug) {
    console.error('Invalid tenant object passed to generateTenantCSS:', tenant);
    throw new Error('Invalid tenant object provided for CSS generation.');
  }

  const { colors, typography, radius } = tenant;

  // Use optional chaining (?.) and nullish coalescing (??) for defaults
  const primaryColor = colors?.primary ?? defaults.colors.primary;
  const primaryForeground = colors?.primaryForeground ?? defaults.colors.primaryForeground;
  const secondaryColor = colors?.secondary ?? defaults.colors.secondary;
  const secondaryForeground = colors?.secondaryForeground ?? defaults.colors.secondaryForeground;
  const accentColor = colors?.accent ?? defaults.colors.accent;
  const accentForeground = colors?.accentForeground ?? defaults.colors.accentForeground;
  const backgroundColor = colors?.background ?? defaults.colors.background;
  const foregroundColor = colors?.foreground ?? defaults.colors.foreground;
  const tenantRadius = radius ?? defaults.radius;

  let cssLines: string[] = [];

  // Color variables
  cssLines.push(`  --background: ${backgroundColor};`);
  cssLines.push(`  --foreground: ${foregroundColor};`);
  cssLines.push(`  --primary: ${primaryColor};`);
  cssLines.push(`  --primary-foreground: ${primaryForeground};`);
  cssLines.push(`  --secondary: ${secondaryColor};`);
  cssLines.push(`  --secondary-foreground: ${secondaryForeground};`);
  cssLines.push(`  --accent: ${accentColor};`);
  cssLines.push(`  --accent-foreground: ${accentForeground};`);
  cssLines.push(`  --radius: ${tenantRadius};`);


  const headingFont = actualFontInstanceVariables[typography.headingFont.name]
  const bodyFont = actualFontInstanceVariables[typography.bodyFont.name]
  cssLines.push(`  --font-heading: var(${headingFont});`);
  cssLines.push(`  --font-body: var(${bodyFont});`);

  // Note: Other shadcn variables like --card, --popover, --muted, --destructive, --border, --input, --ring 
  // will use their default values from globals.css unless explicitly overridden here.

  // Determine chosen font names, defaulting to 'Inter'
  // const headingFontName = typography?.headingFont?.name;
  // const bodyFontName = typography?.bodyFont?.name;

  // Get the actual next/font instance variable names
  // const headingFontActualVariable = actualFontInstanceVariables[headingFontName] || actualFontInstanceVariables['Inter'];
  // const bodyFontActualVariable = actualFontInstanceVariables[bodyFontName] || actualFontInstanceVariables['Inter'];
// 
  // Get the tenant's desired abstract variable names (e.g., --font-heading)
  // const headingFontTenantVariable = typography?.headingFont?.variableName; // This is e.g. --font-heading
  // const bodyFontTenantVariable = typography?.bodyFont?.variableName;     // This is e.g. --font-body

  // Make the tenant's abstract font variables point to the actual next/font CSS variables
  // if (headingFontTenantVariable && headingFontActualVariable) {
  //   cssLines.push(`  ${headingFontTenantVariable}: var(${headingFontActualVariable});`);
  // }
  // if (bodyFontTenantVariable && bodyFontActualVariable) {
  //   cssLines.push(`  ${bodyFontTenantVariable}: var(${bodyFontActualVariable});`);
  // }
  
  // Note: Tenant-chosen weights and subsets from tenant.typography.displayFont.weights etc.
  // are not directly used here to alter the preloaded next/font behavior.
  // The preloaded fonts in layout.tsx have fixed weights/subsets.

  // Font variables
  // Uses `variableName` from tenant config (e.g., '--font-heading') as the CSS property.
  // Uses `name` from tenant config (e.g., 'Lato') to find the `next/font` instance variable.
  // if (typography?.headingFont?.name && typography.headingFont.variableName) {
  //   const fontName = typography.headingFont.name;
  //   const logicalVarName = typography.headingFont.variableName; // This should be --font-heading (from updated tenant data)
  //   const instanceVar = actualFontInstanceVariables[fontName];

  //   if (instanceVar) {
  //     cssLines.push(`  ${logicalVarName}: var(${instanceVar});`);
  //   } else {
  //     console.warn(`CSS Generator: Instance variable for heading font '${fontName}' not found. Check actualFontInstanceVariables map.`);

  //   }
  // }

  // if (typography?.bodyFont?.name && typography.bodyFont.variableName) {
  //   const fontName = typography.bodyFont.name;
  //   const logicalVarName = typography.bodyFont.variableName; // This should be --font-body (from updated tenant data)
  //   const instanceVar = actualFontInstanceVariables[fontName];

  //   if (instanceVar) {
  //     cssLines.push(`  ${logicalVarName}: var(${instanceVar});`);
  //   } else {
  //     console.warn(`CSS Generator: Instance variable for body font '${fontName}' not found. Check actualFontInstanceVariables map.`);

  //   }
  // }

  if (cssLines.every(line => line.includes(': undefined;') || line.includes(': null;') || line.trim() === '' || line.includes('var(undefined)') )) {
    // A more robust check to see if any meaningful CSS was generated
    // This check might need refinement based on typical variable outputs
    let hasMeaningfulCss = false;
    const tempRoot = `:root{\n${cssLines.join('\n')}\n}`;
    if (!tempRoot.includes('var(undefined)') && !tempRoot.includes(': undefined;') && !tempRoot.includes(': null;') && cssLines.length > 0) {
        // Basic check, if after joining, there are non-empty lines that don't seem to be broken variable assignments.
        // This is still a heuristic.
        if (cssLines.filter(l => l.trim() !== '').length > 0) hasMeaningfulCss = true;
    }
    if (!hasMeaningfulCss && cssLines.length > 0) {

    } 
   
  }



  const css = `
/* Tenant: ${tenant.name || tenant.slug} (${tenant.slug}) */
/* Generated: ${new Date().toISOString()} */

:root {
${cssLines.join('\n')}
}
`;

  return css;
} 