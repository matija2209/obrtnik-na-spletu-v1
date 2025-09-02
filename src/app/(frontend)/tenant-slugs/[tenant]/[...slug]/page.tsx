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

// Route configuration constants
const ROUTE_CONFIGS = {
  storitve: 'service',
  projekti: 'project',
  izdelki: 'product'
} as const

// Union type for all page types
type AnyPageType = Page | ServicePage | ProjectPage | ProductPage

type Props = {
  params: Promise<{ slug?: string[] }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

// Helper function to normalize slug array
function normalizeSlug(slug?: string[]): string[] {
  return slug === undefined || slug.length === 0 ? ['home'] : slug
}

// Helper function to determine page type from slug
function getPageTypeFromSlug(slug: string[]): 'service' | 'project' | 'product' | 'general' {
  if (slug.length > 1) {
    const routeKey = slug[0] as keyof typeof ROUTE_CONFIGS
    return ROUTE_CONFIGS[routeKey] || 'general'
  }
  return 'general'
}

// Helper function to query page by type
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

// Main function to get page by slug
async function getPageBySlug(safeSlug: string[], tenantId: number | null, overrideAccess = false, draft = false) {
  const pageType = getPageTypeFromSlug(safeSlug)
  return queryPageByType(pageType, safeSlug, tenantId, overrideAccess, draft)
}

// Helper function to render page blocks based on page type
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

// CRITICAL: Generate static params to enable Full Route Cache
export async function generateStaticParams() {
  return await getStaticPaths()
}

// Generate SEO metadata for the page
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
