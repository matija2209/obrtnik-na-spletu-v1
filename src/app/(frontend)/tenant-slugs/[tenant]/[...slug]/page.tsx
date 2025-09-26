/**
 * @fileoverview Dynamic page component for multi-tenant Next.js application
 * 
 * This component handles rendering of dynamic pages across multiple tenants using
 * Next.js catch-all routes. It supports different page types (general, service, 
 * project, product) with tenant-specific content and automatic static generation.
 * 
 * Part of the multi-tenant system where:
 * - Tenants are resolved via middleware from domains or path-based routing
 * - Each tenant has isolated content and theming
 * - Pages support draft mode for live preview functionality
 * - SEO metadata is generated dynamically with OG images
 */

import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React from 'react'
import type { Metadata } from 'next'
import { queryPageBySlug, queryServicePageBySlug,  queryProductPageBySlug, getStaticPaths, queryProjectPageBySlug, getTenantIdBySlug } from '@/lib/payload'
import { Page, ProductPage, ProjectPage, ServicePage } from '@payload-types'
import { RenderServicesPageBlocks } from '@/blocks/RenderServicesPageBlocks'
import { RenderGeneralPageBlocks } from '@/blocks/RenderGeneralPageBlocks'
import { RenderProjectPageBlocks } from '@/blocks/RenderProjectPageBlocks'
import { RenderProductPageBlocks } from '@/blocks/RenderProductPageBlocks'
import { generatePageSEOMetadata } from '@/utilities/seo'
import { getOgParamsFromPage, getOgImageUrl } from '@/lib/og-image'
import { LivePreviewListener } from '@/components/admin/live-preview-listener'

/**
 * Route configuration mapping Slovenian route segments to page types
 * Used for determining which specialized page type to query based on URL structure
 */
const ROUTE_CONFIGS = {
  storitve: 'service',
  projekti: 'project', 
  izdelki: 'product'
} as const

/**
 * Union type representing all possible page types in the system
 * Each type corresponds to a different content structure and rendering strategy
 */
type AnyPageType = Page | ServicePage | ProjectPage | ProductPage

/**
 * Props interface for the dynamic page component
 * Uses Promise wrapper due to Next.js 13+ async params requirement
 */
type Props = {
  params: Promise<{ slug?: string[] }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

/**
 * Normalizes URL slug array to ensure consistent routing behavior
 * 
 * @param slug - Optional array of URL segments from catch-all route
 * @returns Normalized slug array, defaults to ['home'] for empty/undefined input
 * 
 * @example
 * normalizeSlug(undefined) // ['home']
 * normalizeSlug([]) // ['home'] 
 * normalizeSlug(['about']) // ['about']
 * normalizeSlug(['storitve', 'web-design']) // ['storitve', 'web-design']
 */
function normalizeSlug(slug?: string[]): string[] {
  return slug === undefined || slug.length === 0 ? ['home'] : slug
}

/**
 * Determines the specialized page type based on URL slug structure
 * 
 * Analyzes the first segment of multi-segment slugs to identify specialized
 * content types that require different querying and rendering strategies.
 * 
 * @param slug - Normalized slug array from URL
 * @returns Page type identifier for content querying
 * 
 * @example
 * getPageTypeFromSlug(['home']) // 'general'
 * getPageTypeFromSlug(['storitve', 'web-design']) // 'service'
 * getPageTypeFromSlug(['projekti', 'portfolio-site']) // 'project' 
 * getPageTypeFromSlug(['izdelki', 'premium-theme']) // 'product'
 * getPageTypeFromSlug(['unknown', 'page']) // 'general'
 */
function getPageTypeFromSlug(slug: string[]): 'service' | 'project' | 'product' | 'general' {
  if (slug.length > 1) {
    const routeKey = slug[0] as keyof typeof ROUTE_CONFIGS
    return ROUTE_CONFIGS[routeKey] || 'general'
  }
  return 'general'
}

/**
 * Routes page queries to appropriate specialized functions based on page type
 * 
 * This function abstracts the complexity of different content types by routing
 * to the correct Payload CMS query function. Specialized pages use the second
 * slug segment as their identifier, while general pages use the full slug array.
 * 
 * @param pageType - The determined page type from URL analysis
 * @param slug - Complete normalized slug array
 * @param tenantId - Tenant ID for content isolation (null for cross-tenant queries)
 * @param overrideAccess - Whether to bypass access control checks
 * @param draft - Whether to include draft content (for preview mode)
 * @returns Promise resolving to the appropriate page content or null
 * 
 * @example
 * // Service page: /storitve/web-design -> queries with slug[1] = 'web-design'
 * queryPageByType('service', ['storitve', 'web-design'], 1, false, false)
 * 
 * // General page: /about -> queries with full slug = ['about']
 * queryPageByType('general', ['about'], 1, false, false)
 */
function queryPageByType(
  pageType: ReturnType<typeof getPageTypeFromSlug>,
  slug: string[],
  tenantId: number | null,
  overrideAccess: boolean,
  draft: boolean
) {
  switch (pageType) {
    case 'service':
      return queryServicePageBySlug({ slug: slug[1], tenantId, overrideAccess, draft })
    case 'project':
      return queryProjectPageBySlug({ slug: slug[1], tenantId, overrideAccess, draft })
    case 'product':
      return queryProductPageBySlug({ slug: slug[1], tenantId, overrideAccess, draft })
    default:
      return queryPageBySlug({ slug, tenantId, overrideAccess, draft })
  }
}

/**
 * Main page retrieval function that orchestrates type detection and querying
 * 
 * This is the primary entry point for fetching page content. It combines
 * page type detection with appropriate querying to retrieve tenant-specific
 * content while respecting access controls and draft modes.
 * 
 * @param safeSlug - Normalized slug array from URL processing
 * @param tenantId - Tenant ID for content isolation (resolved from middleware)
 * @param overrideAccess - Bypass access controls (used in admin contexts)
 * @param draft - Include draft content (enabled in preview mode)
 * @returns Promise resolving to page content or null if not found
 * 
 * @example
 * // Regular page access
 * await getPageBySlug(['about'], 1, false, false)
 * 
 * // Draft preview access
 * await getPageBySlug(['storitve', 'new-service'], 1, true, true)
 */
async function getPageBySlug(safeSlug: string[], tenantId: number | null, overrideAccess = false, draft = false) {
  const pageType = getPageTypeFromSlug(safeSlug)
  return queryPageByType(pageType, safeSlug, tenantId, overrideAccess, draft)
}

/**
 * Renders appropriate block components based on page type
 * 
 * This function acts as a renderer factory, routing different page types to their
 * specialized block rendering components. Each renderer handles the specific layout
 * and content blocks associated with that page type.
 * 
 * @param page - The page content object from Payload CMS
 * @param searchParams - URL search parameters for dynamic content
 * @param params - Route parameters including tenant and slug information
 * @returns JSX element with rendered page blocks
 * 
 * @example
 * // Service page gets service-specific block renderer
 * renderPageBlocks(servicePage, {}, { tenant: 'client1', slug: ['storitve', 'web'] })
 * 
 * // General page gets standard block renderer  
 * renderPageBlocks(generalPage, { preview: 'true' }, { tenant: 'client1', slug: ['about'] })
 */
function renderPageBlocks(page: AnyPageType, searchParams: Record<string, string | string[] | undefined>, params: { slug?: string[]; tenant: string }) {
  switch (page.pageType) {
    case 'service':
      return (
        <RenderServicesPageBlocks 
          pageType={(page as ServicePage).pageType} 
          blocks={(page as ServicePage).layout} 
          searchParams={searchParams} 
          params={params}
        />
      )
    case 'project':
      return (
        <RenderProjectPageBlocks 
          pageType={(page as ProjectPage).pageType} 
          blocks={(page as ProjectPage).layout} 
          searchParams={searchParams} 
          params={params}
        />
      )
    case 'product':
      return (
        <RenderProductPageBlocks 
          pageType={(page as ProductPage).pageType} 
          blocks={(page as ProductPage).layout} 
          searchParams={searchParams} 
          params={params}
        />
      )
    default:
      return (
        <RenderGeneralPageBlocks 
          pageType={(page as Page).pageType} 
          blocks={(page as Page).layout} 
          searchParams={searchParams} 
          params={params}
        />
      )
  }
}

/**
 * Generates static parameters for Next.js Static Site Generation (SSG)
 * 
 * This function is CRITICAL for enabling Full Route Cache in the multi-tenant system.
 * It pre-generates all possible route combinations across all tenants to ensure
 * optimal performance and proper caching behavior.
 * 
 * @returns Promise resolving to array of static param objects for pre-rendering
 * 
 * @example
 * // Returns paths like:
 * // [{ tenant: 'client1', slug: ['home'] }, { tenant: 'client1', slug: ['about'] }]
 */
export async function generateStaticParams() {
  return await getStaticPaths()
}

/**
 * Generates dynamic SEO metadata for each page
 * 
 * This function creates comprehensive metadata including title, description, and
 * Open Graph images for optimal SEO and social sharing. It handles both tenant-specific
 * content and fallback scenarios gracefully.
 * 
 * @param params - Route parameters containing slug and tenant information
 * @param searchParams - URL search parameters (unused but required by Next.js)
 * @returns Promise resolving to Next.js Metadata object
 * 
 * Key features:
 * - Automatic OG image generation from page content
 * - Fallback metadata for missing pages
 * - Tenant-agnostic querying for metadata (uses null tenantId)
 * - Error handling with graceful degradation
 * 
 * @example
 * // Generates metadata for: /tenant-slugs/client1/about
 * // Returns: { title: 'About Us - Client1', description: '...', openGraph: {...} }
 */
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const { slug } = resolvedParams

  const safeSlug = normalizeSlug(slug)
  
  let page: AnyPageType | null = null

  try {
    page = await getPageBySlug(safeSlug, null, false, false)
  } catch (error) {
    console.error('Error fetching page for metadata:', error)
  }

  // Fallback metadata if page not found
  if (!page) {
    return {
      title: 'Laneks',
      description: 'Profesionalne storitve za vaš dom in podjetje',
    }
  }

  // Generate OG image URL
  let ogImageUrl: string | undefined = undefined;

  // We prefer automatic OG image generation over manual setup.
  if (page) {
    const ogParams = await getOgParamsFromPage(page);
    if (ogParams) {
      ogImageUrl = getOgImageUrl(ogParams);
    }
  }

  // Use the SEO utility function to generate metadata with dynamic OG images
  return generatePageSEOMetadata(page, safeSlug, { ogImageUrl })
}

// OPTIONAL: Force static rendering for all routes
// export const dynamic = 'force-static'

// OPTIONAL: Set revalidation period (in seconds)
// export const revalidate = 3600 // Revalidate every hour

/**
 * Main dynamic page component for multi-tenant application
 * 
 * This is the primary page component that handles all dynamic routes in the
 * multi-tenant system. It processes catch-all routes, resolves tenant context,
 * fetches appropriate content, and renders the page with live preview support.
 * 
 * Route Structure:
 * - /tenant-slugs/[tenant]/[...slug] - Explicit tenant routing
 * - Domain-based routing handled by middleware rewriting to this format
 * 
 * Key Responsibilities:
 * - Tenant resolution from route parameters
 * - Page content fetching with tenant isolation
 * - Draft mode support for live previews
 * - 404 handling for missing content
 * - Appropriate block renderer selection
 * 
 * @param params - Promise containing tenant slug and page slug array
 * @param searchParams - Promise containing URL search parameters
 * @returns JSX element with rendered page or 404
 * 
 * @example
 * // URL: client1.com/services/web-design
 * // Middleware rewrites to: /tenant-slugs/client1/services/web-design
 * // Component receives: { tenant: 'client1', slug: ['services', 'web-design'] }
 */
// eslint-disable-next-line no-restricted-exports
export default async function SlugPage({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: {
  params: Promise<{ slug?: string[]; tenant: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  // Await parameters
  const params = await paramsPromise
  const searchParams = await searchParamsPromise
  // Await parameters

  const { slug, tenant:tenantSlug } = params
  const tenantId = await getTenantIdBySlug(tenantSlug)

  // Get draft mode status
  const { isEnabled: draft } = await draftMode()

  // Normalize slug and query for the page
  const safeSlug = normalizeSlug(slug)
  const page = await getPageBySlug(safeSlug, tenantId, draft, draft)
  
  // If no page is found, return a 404
  if (!page) {
    return notFound()
  }

  // Render the page layout blocks
  return (
    <>
      {draft && <LivePreviewListener/>}
      {renderPageBlocks(page, searchParams, params)}
    </>
  )
}
