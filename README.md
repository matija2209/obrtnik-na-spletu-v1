# Obrtnik na Spletu

A multi-tenant CMS platform built with Next.js and Payload CMS, designed for dynamic website management with tenant-specific customization and multi-lingual support.

## Architecture Overview

This platform combines cutting-edge web technologies to deliver a scalable, multi-tenant solution:

- **Frontend**: Next.js 14+ with App Router and React Server Components
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
| **Frontend** | Next.js 14+ | React framework with App Router |
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

## Documentation

- **[Multi-Tenant System Architecture](src/README.md)** - Complete guide to how tenant matching, routing, and dynamic theme/font injection works in this application
- **[Dynamic Theme & Font System](src/README.md#dynamic-theme--font-system)** - CDN-based theme and font injection system

## Development

### Getting Started
```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local

# Run development server
npm run dev
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