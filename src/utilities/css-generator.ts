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
  cssLines.push(`  --background: ${backgroundColor} !important;`);
  cssLines.push(`  --foreground: ${foregroundColor} !important;`);
  cssLines.push(`  --primary: ${primaryColor} !important;`);
  cssLines.push(`  --primary-foreground: ${primaryForeground} !important;`);
  cssLines.push(`  --secondary: ${secondaryColor} !important;`);
  cssLines.push(`  --secondary-foreground: ${secondaryForeground} !important;`);
  cssLines.push(`  --accent: ${accentColor} !important;`);
  cssLines.push(`  --accent-foreground: ${accentForeground} !important;`);
  cssLines.push(`  --radius: ${tenantRadius} !important;`);


  const headingFont = actualFontInstanceVariables[typography.headingFont.name]
  const bodyFont = actualFontInstanceVariables[typography.bodyFont.name]
  cssLines.push(`  --font-heading: var(${headingFont}) !important;`);
  cssLines.push(`  --font-body: var(${bodyFont}) !important;`);

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