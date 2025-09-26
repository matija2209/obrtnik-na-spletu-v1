# Multi-Tenant System Architecture

This document explains how the multi-tenant system works in this Next.js application, focusing on the tenant matching and routing mechanism.

## Overview

The application supports multiple tenants (clients) using a combination of:
- **Domain-based routing** (e.g., `client1.com` → client1 tenant)
- **Path-based routing** (e.g., `/tenant-slugs/client1/page`)
- **Admin interface** for managing all tenants
- **Dynamic asset generation** (CSS, themes) per tenant

## Architecture Components

### 1. Middleware (`middleware.ts`)

The middleware is the core component that handles tenant resolution and request routing.

#### Request Processing Flow:
1. **Extract hostname** from incoming request
2. **Check Edge Config** for hostname → tenant slug mapping
3. **Extract tenant from path** if using `/tenant-slugs/[slug]/...` format
4. **Set tenant headers** for downstream processing
5. **Rewrite URLs** for internal routing
6. **Set tenant cookie** for client-side access

#### Special Cases:
- **Admin subdomain** (`admin.obrtniknaspletu.si`):
  - Root `/` → rewrites to `/admin` with slug `admin`
  - Paths like `/tenant-slugs/[slug]/...` → direct tenant access
  - Other paths → defaults to slug `admin`

### 2. Tenant Management (`collections/Tenants/`)

Tenants are managed through Payload CMS with automatic asset generation.

#### afterChange Hook Flow:
1. **Tenant created/updated** in Payload CMS
2. **Domain mapping updated** in Vercel Edge Config
3. **CSS generation triggered** with debouncing (2 seconds)
4. **Assets uploaded** to R2 storage
5. **Cache tags revalidated** for affected resources

#### Key Features:
- **Debounced processing** prevents multiple rapid generations
- **Edge Config updates** handle domain mapping changes  
- **Asset generation** creates tenant-specific CSS and theme configs
- **Cache invalidation** ensures fresh content delivery

## Tenant Resolution Logic

### Priority Order:
1. **Hardcoded admin** (`admin.obrtniknaspletu.si`)
2. **Edge Config lookup** (domain → slug mapping)
3. **Path extraction** (`/tenant-slugs/[slug]/...`)
4. **Default fallback** (`'default'` slug)

### URL Rewriting Examples:

| Input | Tenant Resolution | Internal Path | Headers |
|-------|------------------|---------------|---------|
| `client1.com/products` | Edge Config: `client1` | `/tenant-slugs/client1/products` | `X-Tenant-Slug: client1` |
| `example.com/tenant-slugs/client2/about` | Path extraction: `client2` | `/tenant-slugs/client2/about` | `X-Tenant-Slug: client2` |
| `admin.obrtniknaspletu.si/` | Hardcoded: `admin` | `/admin` | `X-Tenant-Slug: admin` |
| `admin.obrtniknaspletu.si/tenant-slugs/client1/dashboard` | Path extraction: `client1` | `/tenant-slugs/client1/dashboard` | `X-Tenant-Slug: client1` |
| `unknown.com/page` | Default fallback | `/tenant-slugs/default/page` | `X-Tenant-Slug: default` |

## Configuration

### Environment Variables Required:
```bash
EDGE_CONFIG=your-vercel-edge-config-id
# R2 storage configuration for assets
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET_NAME=
CLOUDFLARE_R2_ENDPOINT=
```

### Middleware Matcher:
```javascript
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
```

## Asset Management

### CSS Generation:
- **Triggered** by tenant changes via afterChange hook
- **Debounced** to prevent excessive generation (2 second delay)
- **Uploaded** to R2 storage with tenant-specific paths
- **Cached** with revalidation tags

### Theme Configuration:
- **JSON configs** generated per tenant
- **Stored** alongside CSS in R2
- **Cache tags** for selective invalidation

### Cache Strategy:
- **TENANT_CSS_TAG**: Invalidates tenant-specific CSS
- **TENANT_THEME_CONFIG_TAG**: Invalidates theme configurations
- **Selective revalidation** based on affected tenants

## Debugging

### Middleware Logging:
The middleware logs all processing steps:
```javascript
console.log(`Middleware processing: Host=${hostname}, Path=${pathname}`);
console.log(`Found tenant '${tenantSlug}' from Edge Config for hostname '${hostname}'`);
console.log(`Rewriting host '${hostname}' path '${pathname}' to '${url.pathname}'`);
```

### Common Issues:

1. **Tenant not found**: Check Edge Config mapping
2. **Assets not loading**: Verify R2 configuration and upload status
3. **Wrong tenant resolved**: Check hostname vs path priority
4. **Cache issues**: Verify tag revalidation is working

### Useful Headers for Development:
- `X-Tenant-Slug`: Shows resolved tenant
- `current-tenant` cookie: Client-side tenant access

## Development Workflow

### Adding New Tenant:
1. **Create tenant** in Payload CMS admin
2. **Set domain** field (triggers Edge Config update)
3. **Assets generated** automatically via afterChange hook
4. **Test routing** with both domain and path access

### Testing Tenant Resolution:
1. **Use admin interface**: `admin.obrtniknaspletu.si/tenant-slugs/[slug]/...`
2. **Check headers**: Inspect `X-Tenant-Slug` value
3. **Verify Edge Config**: Check Vercel dashboard for mappings
4. **Monitor logs**: Watch middleware console output

## Security Considerations

- **Tenant isolation**: Each tenant's data is separated by slug
- **Domain verification**: Edge Config prevents unauthorized domain claiming
- **Admin access**: Admin subdomain has special privileges
- **Cookie security**: Tenant cookies are httpOnly with proper path

## Performance Optimizations

- **Edge Config caching**: Fast domain lookups at edge locations
- **Debounced asset generation**: Prevents excessive processing
- **R2 CDN**: Fast asset delivery via Cloudflare
- **Selective cache invalidation**: Only affected resources revalidated

## Dynamic Theme & Font System

### Overview

The application features a sophisticated CDN-based theme and font injection system that allows each tenant to have completely customized styling without rebuilding the application. This system overrides the base `globals.css` with tenant-specific CSS and fonts loaded dynamically from R2 storage.

### Architecture

#### 1. Base Layer (`app/(frontend)/globals.css`)
- **Tailwind CSS** with custom properties system
- **CSS Variables** for colors, fonts, and spacing
- **Default theme** with fallback values
- **Font variables**: `--font-heading`, `--font-body`

#### 2. Font Preloading System (`app/(frontend)/layout.tsx`)

**Module-Scope Font Instances:**
```typescript
// Pre-loaded Google Fonts instances with unique CSS variables
const inter_font_instance = Inter({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-inter-instance',
  display: 'swap',
});

// Mapping for runtime font selection
const preloadedFontInstances: Record<string, NextFontWithVariable> = {
  'Inter': inter_font_instance,
  'Roboto': roboto_font_instance,
  'Open_Sans': open_sans_font_instance,
  'Lato': lato_font_instance,
  'Montserrat': montserrat_font_instance,
};
```

#### 3. Dynamic CSS Injection

**Tenant CSS Override Process:**
1. **Fetch tenant config** from R2: `/tenant-configs/{slug}.json`
2. **Load tenant CSS** from R2: `/tenant-styles/{slug}.css`
3. **Inject CSS** into `<head>` via `dangerouslySetInnerHTML`
4. **Apply font classes** to `<html>` element

**CSS Injection in Layout:**
```typescript
// Fetch tenant-specific CSS from CDN
const { tenantCSS, useFallbackStyles } = await fetchTenantStyles(tenantSlug, isDraftMode);

// Inject CSS into head
{tenantCSS && (
  <style 
    id={`tenant-styles-${tenantSlug}`} 
    dangerouslySetInnerHTML={{ __html: tenantCSS }} 
  />
)}
```

### Font System Mechanics

#### Font Resolution Priority:
1. **Tenant theme config** (from R2 JSON)
2. **Default tenant config** (fallback)
3. **Hardcoded defaults** (Inter font)

#### Font Loading Process:
```typescript
// 1. Get tenant theme configuration
const themeConfig = await getTenantThemeConfig(tenantSlug, isDraftMode);

// 2. Resolve active font classes from preloaded instances
const activeFontClasses = getTenantFontClasses(themeConfig, defaultConfig, preloadedFontInstances);

// 3. Apply font classes to HTML element
<html className={activeFontClasses.join(' ')}>
```

#### Font Variable Mapping:
- **Tenant Config**: `{ name: "Roboto", variableName: "--font-heading" }`
- **CSS Generation**: `--font-heading: var(--font-roboto-instance)`
- **Global CSS**: `font-family: var(--font-heading)`

### CDN Asset Structure

#### R2 Storage Layout:
```
/tenant-configs/
├── default.json          # Default tenant theme config
├── client1.json          # Client-specific theme config
└── client2.json

/tenant-styles/
├── versions.json         # Cache busting versions
├── default.css           # Default tenant styles
├── client1.css           # Client-specific CSS
└── client2.css

/design-configs/
└── design.json           # Global design configuration

/design-styles/
├── versions.json
└── design.css            # Global design overrides
```

#### Theme Config JSON Structure:
```json
{
  "slug": "client1",
  "typography": {
    "headingFont": {
      "name": "Montserrat",
      "weights": ["700"],
      "variableName": "--font-heading",
      "subsets": ["latin"]
    },
    "bodyFont": {
      "name": "Open_Sans", 
      "weights": ["400"],
      "variableName": "--font-body",
      "subsets": ["latin"]
    }
  }
}
```

### CSS Override System

#### Cascade Priority:
1. **Base styles** (`globals.css`)
2. **Global design CSS** (from `/design-styles/design.css`)
3. **Tenant-specific CSS** (from `/tenant-styles/{slug}.css`)

#### CSS Variable Override Example:
```css
/* globals.css (base) */
:root {
  --primary: oklch(0.82 0.1663 83.77);
  --font-heading: var(--font-inter-instance);
}

/* tenant-styles/client1.css (override) */
:root {
  --primary: oklch(0.65 0.2 250);
  --font-heading: var(--font-montserrat-instance);
}
```

### Caching Strategy

#### Cache Tags:
- **Tenant CSS**: `TENANT_CSS_TAG(tenantSlug)` 
- **Tenant Config**: `TENANT_THEME_CONFIG_TAG(tenantSlug)`
- **Design CSS**: `DESIGN_CSS_TAG`

#### Cache Timing:
- **Production**: 3600s (1 hour) with tag-based invalidation
- **Draft Mode**: No cache (`revalidate: 0`)
- **Development**: Cache busting with timestamps

#### Version Management:
```json
// versions.json
{
  "client1": 1672531200000,
  "client2": 1672534800000,
  "default": 1672528600000
}
```

### Performance Optimizations

#### Font Loading:
- **Preloaded instances** at build time
- **Variable fonts** with `font-display: swap`
- **Subset optimization** (latin, cyrillic, etc.)

#### CSS Loading:
- **Inline injection** for critical tenant styles
- **Fallback system** to default styles
- **Edge caching** via Cloudflare R2

#### Debug Information:
```typescript
// Development tenant indicator
<body 
  className={`tenant-${tenantSlug}`}
  data-tenant={tenantSlug}
  data-tenant-status={useFallbackStyles ? 'fallback' : 'active'}
>

// Visual debug indicator (dev only)
Tenant: client1 
Fonts: H: Montserrat, B: Open_Sans
```

### Error Handling & Fallbacks

#### Fallback Hierarchy:
1. **Tenant CSS fails** → Default tenant CSS
2. **Default CSS fails** → Global CSS only
3. **Font config missing** → Inter font defaults
4. **R2 unavailable** → Hardcoded defaults

#### Status Indicators:
- **`active`**: Tenant CSS successfully loaded
- **`r2-default-fallback`**: Using default tenant CSS
- **`global-fallback`**: Using only global CSS

### Development Workflow

#### Testing Themes:
1. **Update tenant** in Payload CMS
2. **CSS generated** via afterChange hook
3. **Assets uploaded** to R2 storage
4. **Cache invalidated** with revalidation tags
5. **Changes visible** on next request

#### Adding New Fonts:
1. **Install font** via `next/font/google`
2. **Add instance** to `preloadedFontInstances`
3. **Update TypeScript** types if needed
4. **Configure in** Payload CMS options

## File Structure

```
src/
├── middleware.ts                    # Main tenant resolution logic
├── app/(frontend)/
│   ├── layout.tsx                  # Dynamic theme & font injection
│   └── globals.css                 # Base CSS with variables
├── collections/
│   └── Tenants/
│       └── hooks/
│           └── afterChange.ts       # Asset generation & Edge Config updates
├── lib/
│   ├── edge-config.ts              # Edge Config management
│   └── r2-client.ts                # R2 storage client
└── utilities/
    ├── css-generator.ts            # Tenant CSS generation
    └── themeUtils.ts               # Theme configuration & CDN utilities
```