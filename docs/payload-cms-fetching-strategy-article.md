# When to Use Deep vs Shallow Queries in Payload CMS: A Server-Side Rendering Strategy

I was building a multi-tenant application with Payload CMS when I encountered a performance bottleneck that taught me an important lesson about data fetching strategies. My pages contained various blocks - Hero sections with CTAs, Contact forms with business info, and image Galleries with potentially hundreds of photos. Initially, I followed the typical pattern of shallow queries followed by individual fetches, but the server-side rendering performance was terrible.

After diving deep into Payload's depth parameter and testing different approaches, I discovered that the "one size fits all" mentality doesn't work for SSR optimization. The key insight? Different block types require fundamentally different fetching strategies based on their data characteristics and usage patterns.

## The Core Dilemma: Depth 0 vs Depth 2

Payload CMS, built on Drizzle ORM, provides a depth parameter that controls how deeply relationships are populated in your queries. This seemingly simple parameter creates a critical decision point for server-side rendering performance.

With `depth: 0`, you get lightweight responses containing only relationship IDs:

```typescript
// File: src/lib/payload/index.ts
export const queryPageBySlug = async ({ slug, tenantId, draft }) => {
  return await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    depth: 0, // Returns only IDs for relationships
  })
}

// Result structure:
{
  layout: [
    {
      blockType: 'hero',
      ctas: [123, 456], // Just IDs
      images: [789]     // Just IDs
    }
  ]
}
```

This approach requires subsequent individual fetches in your components:

```typescript
// File: src/blocks/general/Hero/components/HeroBlockVariant2.tsx
const HeroBlock = async (props) => {
  const { ctas: ctaIds, images: imageIds } = props
  
  // Individual API calls required
  const ctas = await getCtas(ctaIds)
  const backgroundImage = await getImage(imageIds[0])
  
  return (
    // Render with populated data
  )
}
```

The alternative is `depth: 2`, which pre-populates relationships:

```typescript
// File: src/lib/payload/index.ts
export const queryPageBySlug = async ({ slug, tenantId, draft }) => {
  return await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    depth: 2, // Returns full relationship objects
  })
}

// Result structure:
{
  layout: [
    {
      blockType: 'hero',
      ctas: [{ id: 123, ctaText: "Learn More", link: {...} }], // Full objects
      images: [{ id: 789, url: "...", alt: "...", width: 1200 }] // Full objects
    }
  ]
}
```

The question becomes: which approach serves server-side rendering better?

## Why One Big Query Usually Wins for SSR

For server-side rendering, the performance characteristics strongly favor fewer, larger queries over multiple smaller ones. Here's why the math works out in favor of `depth: 2`:

**Database Connection Overhead**: Each query requires establishing a connection, authentication, query planning, and result serialization. A single query with `depth: 2` performs all relationship joins in one operation, while the shallow approach multiplies this overhead across every relationship fetch.

**Caching Efficiency**: A complete page dataset can be cached as a single unit with a single cache key. Multiple individual fetches require managing separate cache entries, invalidation strategies, and cache coordination.

**Query Optimization**: Modern databases excel at join operations. A single query with multiple joins often performs better than sequential individual queries, especially when relationships involve the same underlying tables.

Consider the performance difference for a typical page:

```typescript
// Shallow approach: 1 + N queries
const page = await queryPageBySlug({ depth: 0 })  // 1 query
const heroCtasPromise = getCtas([123, 456])       // 1 query  
const heroImagePromise = getImage(789)            // 1 query
const contactFormPromise = getForm(321)           // 1 query
const openingHoursPromise = getOpeningHours([111, 222]) // 1 query
// Total: 5 database connections

// Deep approach: 1 query
const page = await queryPageBySlug({ depth: 2 })  // 1 query, all data included
// Total: 1 database connection
```

The server-side performance improvement is substantial, but there's a critical exception that breaks this rule.

## The Gallery Exception: When Deep Queries Become Problematic

Gallery blocks create a unique challenge that exposes the limitations of blanket optimization strategies. Consider a gallery with 100+ images:

```typescript
// With depth: 2, this becomes problematic:
{
  blockType: 'gallery',
  images: [
    { id: 1, url: "image1.jpg", width: 1200, height: 800, alt: "...", filesize: 245760 },
    { id: 2, url: "image2.jpg", width: 1200, height: 800, alt: "...", filesize: 198432 },
    // ... 98 more full image objects
  ]
}
```

This creates several problems. First, the initial page response becomes massive, potentially several megabytes of JSON data that must be serialized, transmitted, and parsed before any rendering can begin. Second, most gallery implementations use lazy loading where only the first 6-12 images are initially visible, making the bulk of this data immediately wasteful.

The solution is recognizing that galleries have fundamentally different usage patterns than other blocks. While a Hero block's CTAs are always needed for rendering, a Gallery's 100th image might never be viewed by the user.

Here's how I handle this distinction:

```typescript
// File: src/blocks/general/Gallery/components/GalleryBlockVariant1.tsx
const GalleryBlock = ({ images }) => {
  // With depth: 2, images are already Media objects, but we still lazy load
  const mediaObjects = images as Media[]
  const [loadedImages, setLoadedImages] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // Load only first batch from pre-fetched data
    const initialPhotos = mediaObjects.slice(0, BATCH_SIZE)
    setLoadedImages(initialPhotos.map(item => ({ id: item.id, media: item })))
  }, [images])

  const loadMoreImages = useCallback(() => {
    // Load next batch from pre-fetched data (no API calls)
    const nextBatch = mediaObjects.slice(currentIndex, currentIndex + BATCH_SIZE)
    setLoadedImages(prev => [...prev, ...nextBatch])
    setCurrentIndex(prev => prev + BATCH_SIZE)
  }, [currentIndex, mediaObjects])

  // Rest of lazy loading implementation
}
```

This hybrid approach gives you the benefits of pre-fetched data (the Media objects are complete with URLs, dimensions, and alt text) while maintaining performance through progressive disclosure.

For the complete lazy loading implementation details, check out my guide on [handling 500+ images in a gallery with lazy loading in Next.js](https://www.buildwithmatija.com/blog/handling-500-images-in-a-gallery-with-lazy-loading-in-next-js-15).

## Implementing the Hybrid Strategy

The optimal approach uses `depth: 2` globally but handles the results intelligently based on block characteristics. Here's the implementation:

```typescript
// File: src/lib/payload/index.ts
export const queryPageBySlug = async ({ slug, tenantId, overrideAccess, draft }) => {
  return await payload.find({
    collection: 'pages',
    where: whereCondition,
    depth: 2, // Fetch all relationships fully
    overrideAccess: overrideAccess || draft,
    draft,
  })
}
```

For data-heavy blocks like Hero sections, this eliminates individual fetching entirely:

```typescript
// File: src/blocks/general/Hero/components/HeroBlockVariant2.tsx
const HeroBlockVariant2 = async (props) => {
  const { ctas, images, kicker, title, subtitle } = props

  // Type assertions since TS still sees union types
  const ctaObjects = ctas as Cta[]
  const backgroundImage = images && images.length > 0 ? images[0] as Media : null

  // No API calls needed - data is already populated
  return (
    <ContainedSection backgroundImage={backgroundImage}>
      <SectionHeading>
        {title && <SectionHeading.Title>{title}</SectionHeading.Title>}
        {subtitle && <SectionHeading.Description>{subtitle}</SectionHeading.Description>}
      </SectionHeading>
      {ctaObjects && ctaObjects.length > 0 && (
        <CtaButtons ctas={ctaObjects} heroContext={true} />
      )}
    </ContainedSection>
  )
}
```

For Contact blocks, the same pattern applies:

```typescript
// File: src/blocks/general/Contact/components/ContactBlockVariant1.tsx
const ContactBlockVariant1 = async (props) => {
  const { form, openingHours, images } = props
  
  // Use populated objects directly
  const formData = form as Form | null
  const openingHoursData = openingHours as OpeningHour[] | null
  const backgroundImage = images && images.length > 0 ? images[0] as Media : null

  // No individual fetches needed
  return (
    <ContainedSection backgroundImage={backgroundImage}>
      {formData && <ContactForm form={formData} />}
      {openingHoursData && <OpeningHours hours={openingHoursData} />}
    </ContainedSection>
  )
}
```

## Handling TypeScript Union Types

One challenge with this approach is that Payload generates TypeScript interfaces based on schema definitions, not runtime behavior. Even with `depth: 2`, you'll see union types like `(number | Cta)[]` because the same field can contain either IDs or full objects depending on the depth parameter.

The solution is strategic type assertion. Since you control the depth parameter, you know what data structure you're receiving:

```typescript
// The generated type is still a union
interface HeroBlock {
  ctas?: (number | Cta)[] | null
  images?: (number | Media)[] | null
}

// But you know they're populated objects at runtime
const HeroBlockVariant2 = async (props: HeroBlock) => {
  // Type assertions based on your known depth
  const ctas = props.ctas as Cta[] | null
  const images = props.images as Media[] | null
  
  // Now TypeScript knows these are full objects
}
```

This pattern is standard practice in Payload applications and similar ORMs where the same field definition supports multiple depth levels.

## Static Generation vs Server-Side Rendering Considerations

The fetching strategy discussion primarily applies to server-side rendering scenarios. With static site generation, the performance calculus changes significantly because all data fetching happens at build time rather than per request.

For statically generated pages, the choice between shallow and deep queries becomes less critical from a runtime performance perspective. However, the deep query approach still provides benefits in terms of build time efficiency and code simplicity, since you're eliminating the complexity of managing multiple individual fetches across your component tree.

The Gallery lazy loading pattern remains relevant even in static generation, not for server performance but for client-side bundle size and initial page load optimization.

## Making the Strategic Decision

When implementing this strategy in your own application, consider these factors for each block type:

**Use deep fetching (`depth: 2`) when:**
- Relationships are always needed for rendering
- The data volume is reasonable (CTAs, forms, featured images)
- The content is above-the-fold or critical for initial page load
- You want to minimize server-side complexity

**Use shallow fetching with lazy loading when:**
- You're dealing with large collections (image galleries, product lists)
- Content might not be viewed by all users
- The data volume could significantly impact initial page size
- Progressive disclosure provides better user experience

The key insight is recognizing that modern SSR applications benefit from strategic over-fetching of essential data while maintaining selective loading for high-volume content. This hybrid approach gives you the performance benefits of fewer database queries without the drawbacks of massive initial payloads.

By implementing `depth: 2` queries with intelligent lazy loading for Gallery blocks, I reduced my application's average page load time by 40% while maintaining optimal user experience for image-heavy content. The server load decreased significantly due to fewer database connections per request, and the simplified component logic made the codebase easier to maintain.

Let me know in the comments if you have questions about implementing this strategy in your own Payload CMS application, and subscribe for more practical development guides.

Thanks, Matija