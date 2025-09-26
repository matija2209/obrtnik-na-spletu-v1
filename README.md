# Obrtnik na Spletu

A multi-tenant CMS platform built with Next.js and Payload CMS, designed for dynamic website management with tenant-specific customization and multi-lingual support.

## DEMO for Ad Art

**LOGIN LINK**

https://admin.obrtniknaspletu.si/admin/login

**Email:** demo@adart.com  
**Password:** adart2025

## Architecture Overview

This platform combines cutting-edge web technologies to deliver a scalable, multi-tenant solution:

- **Frontend**: Next.js 15+ with App Router and React Server Components
- **CMS**: Payload CMS with multi-tenant collection architecture
- **Database**: Serverless Neon DB (PostgreSQL)
- **Storage**: Cloudflare R2 for blob storage and CDN delivery
- **Hosting**: Vercel with Edge Functions
- **Caching**: Vercel Edge Config for dynamic routing

## Key Features

### Multi-Tenant Architecture
- **Dynamic tenant resolution** via domain mapping or path-based routing
- **Isolated data** per tenant with shared infrastructure
- **Custom themes** and styling per tenant via CDN injection
- **Scalable on-the-fly** tenant creation and management

### Content Management
- **Block-based architecture** for flexible page building
- **Reusable field components** for consistent styling options
- **Multi-lingual support** (Slovenian, German, English)
- **Media management** with optimized delivery via R2

### Performance & Scalability
- **Edge-optimized** routing and caching
- **Serverless database** with connection pooling
- **CDN-based asset delivery** for global performance
- **Dynamic CSS/font injection** without rebuilds

## Technical Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | Next.js 15+ | React framework with App Router |
| **CMS** | Payload CMS | Headless CMS with TypeScript |
| **Database** | Neon DB (PostgreSQL) | Serverless PostgreSQL database |
| **Storage** | Cloudflare R2 | Object storage and CDN |
| **Hosting** | Vercel | Edge functions and deployment |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Caching** | Vercel Edge Config | Dynamic configuration at edge |
| **Fonts** | Next.js Font Optimization | Google Fonts with optimization |

## Block System

The platform uses a flexible block-based content system allowing editors to build pages using reusable components:

### Available Blocks
- **Hero** - Landing page headers with CTAs
- **About** - Company information sections
- **Services** - Service listings with icons
- **Gallery** - Image galleries with lightbox
- **Testimonials** - Customer reviews and quotes
- **Contact** - Contact forms and information
- **FAQ** - Frequently asked questions
- **CTA** - Call-to-action sections
- **Form** - Custom form builder
- **Text** - Rich text content blocks
- **Featured Products** - Product showcases
- **How To** - Step-by-step guides
- **Project Highlights** - Portfolio showcases
- **Service Area** - Geographic service maps
- **Machinery** - Equipment and machinery displays

### Block Implementation
```typescript
// src/blocks/RenderGeneralPageBlocks.tsx
const blockComponents = {
  hero: HeroBlock,
  about: AboutBlock,
  services: ServicesBlock,
  gallery: GalleryBlock,
  // ... additional blocks
}
```

### Detailed Block Architecture

#### Overview
The blocks system is made up of three coordinated layers that keep authoring flexible while maintaining strong typing:

1. **Block configurations** (`config.ts`) define Payload CMS schemas and authoring options.
2. **React components** (`components/`) render layouts on the frontend.
3. **Render controllers** (`Render*PageBlocks.tsx`) map block data to the correct React components at runtime.

#### Folder Structure
```
src/blocks/
├── general/                # Reusable blocks for all page types
├── blog/                   # Blog-specific blocks
├── projects/               # Project-specific blocks
├── services/               # Service-specific blocks
├── shop/                   # E-commerce specific blocks
├── about/                  # About page specific blocks
├── Render*PageBlocks.tsx   # Page-specific renderers
└── README.md               # Blocks documentation
```

#### Block Organization by Page Type
- `general/` holds universally reusable blocks (hero, CTA, contact, etc.).
- `blog/` contains blog post content elements (banner, code, media block).
- `projects/` focuses on portfolio storytelling (about, presentation, related projects).
- `services/` exposes service-centric layouts (sub-services, packages).
- `shop/` includes commerce experiences (product form with order flow).
- `about/` provides brand storytelling pieces (presentation, leadership).

#### Individual Block Structure
```
BlockName/
├── config.ts                      # Payload CMS schema definition
├── components/
│   ├── index.tsx                  # Template coordinator
│   ├── default-block-name.tsx     # Default template implementation
│   └── VariantName.tsx            # Additional template variants
└── fields/                        # Optional block-specific fields
```

#### Configuration System
Block configuration files export strongly typed Payload block definitions:

```typescript
import type { Block } from "payload";

const BlockName: Block = {
  slug: "blockName",
  interfaceName: "BlockName",
  labels: {
    singular: "Block Name",
    plural: "Block Names",
  },
  imageURL: "/images/blocks/block.png",
  fields: [
    // Field definitions...
  ],
};

export default BlockName;
```

Reusable field factories keep configuration consistent across blocks:

```typescript
import backgroundColour from "@/fields/backgroundColour";
import colourSchema from "@/fields/colourSchema";
import isTransparent from "@/fields/isTransperant";

fields: [
  {
    name: "template",
    label: "Template",
    type: "select",
    required: true,
    defaultValue: "default",
    options: [
      { label: "Default Layout", value: "default" },
      { label: "Variant 1", value: "variant1" },
    ],
  },
  backgroundColour(),
  colourSchema(),
  isTransparent(),
  {
    name: "title",
    type: "text",
    label: "Title",
    localized: true,
    required: true,
  },
  {
    name: "ctas",
    type: "relationship",
    relationTo: "ctas",
    hasMany: true,
    maxRows: 2,
  },
  {
    name: "idHref",
    type: "text",
    defaultValue: "blockname",
  },
];
```

Common field patterns include select dropdowns for templates and styling, localized text inputs, relationships to supporting collections, and standardized anchors (`idHref`) for in-page navigation.

#### Component Coordination
The component entry point for each block switches between template variants and passes shared props:

```typescript
import type { BlockName } from "@payload-types";
import DefaultTemplate from "./default-block-name";
import VariantTemplate from "./BlockVariant2";

const BlockComponent = async ({ searchParams, ...block }: BlockName & { searchParams?: SearchParams }) => {
  switch (block.template) {
    case "default":
      return <DefaultTemplate {...block} />;
    case "variant2":
      return <VariantTemplate {...block} />;
    default:
      return <div>Please select a template for this block.</div>;
  }
};

export default BlockComponent;
```

Template implementations keep markup focused and typed:

```typescript
import { BlockName } from "@payload-types";

const DefaultTemplate: React.FC<BlockName> = ({ title, description, bgColor, colourScheme, idHref }) => {
  return (
    <section id={idHref} className={`block-wrapper ${bgColor} ${colourScheme}`}>
      <div className="container">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </section>
  );
};

export default DefaultTemplate;
```

#### Rendering System
Page-level renderers map layout data to block components and allow custom handling per page type:

```typescript
import HeroBlock from "@/blocks/general/Hero/components";
import AboutBlock from "@/blocks/general/About/components";

const blockComponents = {
  hero: HeroBlock,
  about: AboutBlock,
};

export const RenderGeneralPageBlocks: React.FC<{
  pageType: Page["pageType"];
  blocks: Page["layout"];
  searchParams?: SearchParams;
}> = ({ blocks, searchParams }) => {
  if (!blocks?.length) return null;

  return (
    <Fragment>
      {blocks.map((block, index) => {
        const { blockType } = block;

        if (blockType && blockType in blockComponents) {
          const Block = blockComponents[blockType];
          return <Block key={index} {...block} searchParams={searchParams} />;
        }

        return null;
      })}
    </Fragment>
  );
};
```

Special cases (for example galleries that need z-index wrappers or project pages that drop the inner container) are handled inline within the renderer switch before the component is returned.

#### Conventions & Best Practices
- Config files export defaults from `config.ts`.
- Component coordinators live in `components/index.tsx` and manage template switching.
- Default templates follow the `default-[block-name].tsx` naming convention; variants use PascalCase.
- Slugs remain kebab-case (`cta_block`), while TypeScript interfaces follow PascalCase (`CtaBlock`).
- Blocks are async to support server-side rendering and share `SearchParams` typings for uniform props.
- Localization is built-in via `localized: true` fields and localized labels.

#### Adding New Blocks
1. Scaffold the folder structure:
   ```bash
   mkdir src/blocks/[category]/[BlockName]
   mkdir src/blocks/[category]/[BlockName]/components
   touch src/blocks/[category]/[BlockName]/config.ts
   touch src/blocks/[category]/[BlockName]/components/index.tsx
   touch src/blocks/[category]/[BlockName]/components/default-[block-name].tsx
   ```
2. Define the schema in `config.ts` with standard styling fields (`backgroundColour`, `colourSchema`, `isTransparent`, `idHref`).
3. Implement coordinator and template components following the established switch pattern.
4. Register the block in the appropriate `Render*PageBlocks.tsx` file and add it to the relevant Payload collection.

#### Complex Block Example: `shop/ProductForm`
Complex blocks can maintain their own substructure and documentation:

```
ProductForm/
├── config.ts
├── components/
│   ├── index.tsx
│   └── DefaultProductFormComponent/
│       ├── index.tsx
│       └── components/
│           ├── order/
│           └── product-components/
├── ProductVariantSelector.tsx
└── README.md
```

This pattern supports nested component hierarchies, advanced order flows, and dedicated docs without sacrificing reusability.

## Reusable Field System

The platform includes a comprehensive set of reusable fields that provide consistent styling options across all blocks:

### Background Colors (`src/fields/backgroundColour.ts`)
- Primary, secondary, accent color variants
- Light/dark themes with opacity levels
- Muted and white background options
- Inheritance from global color scheme

### Text Colors (`src/fields/textColour.ts`)
- **Title Color** - Heading text customization
- **Subtitle Color** - Subheading styling
- **Description Color** - Body text formatting
- Color inheritance and contrast optimization

### Icon System (`src/fields/iconsField.ts`)
Comprehensive icon library including:
- **Industry Icons**: Excavator, Front Loader, Bager
- **Nature Icons**: Tree, Sprout, Leaves, Flower
- **Tool Icons**: Shovel, Gardening Shears, Paintbrush
- **Utility Icons**: Phone, Mail, Building
- **Social Icons**: Google, Facebook

### Field Usage Example
```typescript
// Any block can include these reusable fields
export const HeroBlock: Block = {
  slug: 'hero',
  fields: [
    // Content fields
    titleField(),
    descriptionField(),
    
    // Styling fields
    backgroundColour(),
    ...textColors, // titleColor, subtitleColor, descriptionColor
    iconField(),
  ]
}
```

## Product Form Block

A comprehensive product display and ordering experience that integrates Payload CMS blocks with commerce collections.

### Features

#### Product Display
- Rich gallery carousel with thumbnail navigation.
- Pricing, ratings, availability, and manufacturer callouts.
- Feature highlights and technical specifications layout.
- Long-form descriptions rendered with rich text support.

#### Order Form
- Quantity selector with +/- controls.
- Customer and address capture for delivery or installation.
- Live order summary with running totals.
- Full client and server-side validation with success redirects.

### Configuration Options
- Display toggles: `showTitle`, `showSku`, `showManufacturer`, `showType`, `showShortDescription`, `showLongDescription`, `showPricing`, `showAvailability`, `showMountingInfo`, `showTechnicalSpecs`, `showHighlights`, `showMainImage`, `showGallery`, `showReviews`, `showRating`, `showOrderForm`.
- Styling controls: `colourScheme`, `ctaText`, `idHref` for deep-link navigation.

### Integration Points
- Collections: **Products** (source data), **Orders** (order records), **Customers** (auto-create/lookup from submissions).
- Actions: `submitOrder` handles validation, customer resolution, and order creation.

### Component Structure
```
DefaultShopComponent/
├── index.tsx
├── components/
│   ├── product-components/
│   │   ├── ProductGallery.tsx
│   │   ├── ProductInfo.tsx
│   │   └── ProductFeatures.tsx
│   └── order/
│       ├── OrderForm.tsx
│       └── ProductSpecifications.tsx
```

### Usage Workflow
1. Select a product from the Products collection.
2. Toggle which product attributes to display.
3. Customize styling and CTA copy.
4. Configure form submission handling and success destinations.

### Order Processing Lifecycle
1. Validate payload with Zod on both client and server.
2. Create or look up the associated customer record.
3. Persist the order with embedded customer details.
4. Trigger notifications or follow-up actions (currently console logging by default).
5. Redirect the user to the configured thank-you experience.

### Customization & Dependencies
- Built with React Hook Form, Zod, Tailwind CSS, shadcn/ui, and Lucide icons.
- Supports component composition for custom layouts and server actions for bespoke business logic.

## Multi-Lingual Support

The platform supports three languages with automatic locale detection:

- **Slovenian (sl)** - Primary language
- **German (de)** - Secondary language  
- **English (en)** - International support

All field labels, descriptions, and content are localized across the admin interface and frontend.

## Responsive Design

Built mobile-first with Tailwind CSS:
- **Responsive breakpoints** for all devices
- **Touch-optimized** admin interface
- **Progressive enhancement** for modern browsers
- **Accessibility compliant** (WCAG 2.1)

## Deployment & Scaling

### Environment Setup
```bash
# Database
DATABASE_URL=postgresql://...

# Storage
CLOUDFLARE_R2_ACCESS_KEY_ID=...
CLOUDFLARE_R2_SECRET_ACCESS_KEY=...
CLOUDFLARE_R2_BUCKET_NAME=...
S3_CSS_DOMAIN=...

# Edge Config
EDGE_CONFIG=...

# CMS
PAYLOAD_SECRET=...
```

### Performance Characteristics
- **Cold start**: < 500ms (serverless)
- **Edge response**: < 50ms (cached routes)
- **Database queries**: Connection pooling via Neon
- **Asset delivery**: Global CDN via R2

## Automations & Background Jobs

Payload background jobs (configured in `payload.config.ts`) orchestrate asynchronous workflows across tenants:
- Facebook imports turn social posts into projects, galleries, and media assets.
- Gallery and media synchronization keeps block content aligned with the latest uploads.
- Automated project, service, and product page generation bootstraps content from base collections.
- CSV importers accelerate onboarding for paving product lines and similar bulk content.

Vercel Cron triggers `/api/facebook/check-new-posts` hourly. Once content updates succeed, an optional deploy hook (`VERCEL_DEPLOY_HOOK_URL`) can refresh the production site automatically.

## Media & Performance

- S3-backed storage manages uploads with automatic WebP generation and blur placeholders (see `src/collections/Media`).
- Custom `PayloadImage` utilities remove redundant Next.js image work; implementation details live in `docs/IMPLEMENTATION_SUMMARY.md` and `docs/image-optimization-guide.md`.
- `ContainedSection` and gallery components are tuned for graceful loading using blur data.

### Media Collection

Optimized media processing keeps pages snappy across devices.

#### Features
- **Multiple sizes** generated on upload (thumbnail 300×300, card 640×480, tablet 1024 width, original preserved).
- **Blur placeholders** produced as ~10×10 PNGs (~170 bytes) stored as Base64 in `blurDataURL` for smooth loading.
- **S3 storage** with WebP conversion (quality ~80%) and CDN-backed delivery.

#### Upload Flow
```
Upload → Payload processing → Size variants → Blur placeholder → S3 storage
```

Blur placeholders are generated via `hooks/generateBlurPlaceholder.ts`, using Sharp to downscale, blur, encode, and persist data after uploads.

#### Frontend Integration
```tsx
<PayloadImage image={media} alt="Project photo" className="rounded-lg" />
<PayloadImage image={media} alt="Hero" aspectRatio="16/9" priority />
<ContainedSection backgroundImage={media}>...</ContainedSection>
```

#### Fields Overview
| Field | Type | Description |
|-------|------|-------------|
| `alt` | Text | Alternative text for accessibility |
| `width` | Number | Original width in pixels |
| `height` | Number | Original height in pixels |
| `source` | Select | Upload provenance (manual/facebook) |
| `facebookId` | Text | Facebook attachment reference |
| `blurDataURL` | Text | Base64 blur placeholder |

#### Implementation Details
- Sharp handles resizing (Lanczos3), 1px blur radius, and PNG encoding for placeholders.
- Database migration adds `blur_data_u_r_l` via standard Payload migrations.
- Generation completes in ~100–200ms per image with ~0.02% storage overhead.

#### Troubleshooting & Future Work
- If blur data is missing, check Sharp availability and upload accessibility.
- Monitor Sharp resource usage and S3 performance for large batches.
- Roadmap ideas: bulk regeneration, adjustable blur intensity, WebP placeholders, progressive enhancement.

## Documentation

- **[Multi-Tenant System Architecture](src/README.md)** - Complete guide to how tenant matching, routing, and dynamic theme/font injection works in this application
- **[Dynamic Theme & Font System](src/README.md#dynamic-theme--font-system)** - CDN-based theme and font injection system

## Development

### Getting Started

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Configure environment variables** (create `.env.local` or export values):
   - Core: `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, `DATABASE_URL`
   - Storage: `S3_BUCKET`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET`
   - Email: `DEFAULT_FROM_EMAIL`, `DEFAULT_FROM_NAME`, `BREVO_SMTP_HOST`, `BREVO_SMTP_PORT`, `BREVO_SMTP_LOGIN`, `BREVO_SMTP_KEY`
   - Integrations: `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`, per-page tokens for Facebook sync
   - Optional: `VERCEL_DEPLOY_HOOK_URL` for automatic deploy triggers
   Start from `cp .env.example .env.local` to bootstrap the file.

3. **Run the app**
   ```bash
   pnpm dev
   ```
   The command boots Next.js (frontend) and Payload (admin) together in Turbo mode.

4. **Seed a fresh database** (optional for demos)
   ```bash
   SEED=true pnpm payload migrate:fresh
   pnpm seed
   ```

### Code Structure
```
src/
├── app/(frontend)/         # Next.js app router
├── blocks/                 # Content block components
├── collections/            # Payload CMS collections
├── fields/                 # Reusable field definitions
├── components/             # Shared React components
├── lib/                    # Utility libraries
└── utilities/              # Helper functions
```

This platform represents a modern approach to multi-tenant CMS architecture, combining the flexibility of headless CMS with the performance of edge computing and the scalability of serverless infrastructure.
