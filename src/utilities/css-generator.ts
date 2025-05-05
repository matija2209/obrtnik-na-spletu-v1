import type { Tenant } from '../../payload-types'; // Adjust path as needed

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
    typography: {
      displayFont: 'Inter, system-ui, sans-serif',
      bodyFont: 'Inter, system-ui, sans-serif',
      headingWeight: '700',          // Example default
      bodyWeight: '400',            // Example default
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

  // Use optional chaining (?.) and nullish coalescing (??) for defaults
  const primaryColor = tenant.colors?.primary ?? defaults.colors.primary;
  const primaryForeground = tenant.colors?.primaryForeground ?? defaults.colors.primaryForeground;
  const secondaryColor = tenant.colors?.secondary ?? defaults.colors.secondary;
  const secondaryForeground = tenant.colors?.secondaryForeground ?? defaults.colors.secondaryForeground;
  const accentColor = tenant.colors?.accent ?? defaults.colors.accent;
  const accentForeground = tenant.colors?.accentForeground ?? defaults.colors.accentForeground;
  const backgroundColor = tenant.colors?.background ?? defaults.colors.background;
  const foregroundColor = tenant.colors?.foreground ?? defaults.colors.foreground;
  
  // const containerMaxWidth = tenant.spacing?.containerMaxWidth ?? defaults.spacing.containerMaxWidth;
  // const gapDefault = tenant.spacing?.gapDefault ?? defaults.spacing.gapDefault;

  // Remove radius reading as it's not being output
  // const radius = tenant.radius ?? defaults.radius;

  const css = `
/* Tenant: ${tenant.name || tenant.slug} (${tenant.slug}) */
/* Generated: ${new Date().toISOString()} */

:root {
  /* Core Themed Shadcn Colors */
  --background: ${backgroundColor};
  --foreground: ${foregroundColor};
  --primary: ${primaryColor};
  --primary-foreground: ${primaryForeground};
  --secondary: ${secondaryColor};
  --secondary-foreground: ${secondaryForeground};
  --accent: ${accentColor};
  --accent-foreground: ${accentForeground};
  /* Other variables (--card, --popover, --muted, --destructive, --border, --input, --ring, --radius) use defaults from globals.css */
  
  /* Typography variables are handled via Tailwind theme */
}
`;

  return css;
} 