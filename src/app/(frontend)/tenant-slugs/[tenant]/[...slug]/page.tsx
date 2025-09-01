import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React from 'react'
import type { Metadata } from 'next'

import { queryPageBySlug, queryServicePageBySlug, getTenantIdBySlug, getNavbar, getBusinessInfo, getLogoUrl, getFooter } from '@/lib/payload'
import { LivePreviewListener } from '@/components/admin/live-preview-listener'
import Footer from '@/components/layout/footer'
import Navbar from '@/components/layout/navbar'

import { Media, Page, ServicePage } from '@payload-types'
import { RenderServicesPageBlocks } from '@/blocks/RenderServicesPageBlocks'
import { RenderGeneralPageBlocks } from '@/blocks/RenderGeneralPageBlocks'
import { generateSEOMetadata } from '@/utilities/seo'

// Route configuration constants
const ROUTE_CONFIGS = {
  storitve: 'service',
  tretmaji: 'service',
} as const

// Union type for all page types
type AnyPageType = Page | ServicePage

type Props = {
  params: Promise<{ slug?: string[]; tenant: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

// Helper function to normalize slug array
function normalizeSlug(slug?: string[]): string[] {
  return slug === undefined || slug.length === 0 ? ['home'] : slug
}

// Helper function to determine page type from slug
function getPageTypeFromSlug(slug: string[]): 'service' | 'general' {
  if (slug.length > 1) {
    const routeKey = slug[0] as keyof typeof ROUTE_CONFIGS
    return ROUTE_CONFIGS[routeKey] || 'general'
  }
  // Check if any part of the slug indicates a service page
  if (slug.some(part => ['storitve', 'tretmaji'].includes(part))) {
    return 'service'
  }
  return 'general'
}

// Helper function to query page by type
function queryPageByType(
  pageType: ReturnType<typeof getPageTypeFromSlug>,
  slug: string[],
  tenant: string,
  overrideAccess: boolean,
  draft: boolean
) {
  switch (pageType) {
    case 'service':
      return queryServicePageBySlug({ slug, tenant, overrideAccess, draft })
    default:
      return queryPageBySlug({ slug, tenant, overrideAccess, draft })
  }
}

// Main function to get page by slug
async function getPageBySlug(safeSlug: string[], tenant: string, overrideAccess = false, draft = false) {
  const pageType = getPageTypeFromSlug(safeSlug)
  return queryPageByType(pageType, safeSlug, tenant, overrideAccess, draft)
}

// Helper function to render page blocks based on page type
function renderPageBlocks(page: AnyPageType, searchParams: Record<string, string | string[] | undefined>) {
  switch (page.pageType) {
    case 'service':
      return (
        <RenderServicesPageBlocks 
          pageType={(page as ServicePage).pageType} 
          blocks={(page as ServicePage).layout} 
          searchParams={searchParams} 
        />
      )
    default:
      return (
        <RenderGeneralPageBlocks 
          pageType={(page as Page).pageType} 
          blocks={(page as Page).layout} 
          searchParams={searchParams} 
        />
      )
  }
}

// Generate SEO metadata for the page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const { slug, tenant: tenantSlug } = resolvedParams

  // Get tenant ID
  const tenantId = await getTenantIdBySlug(tenantSlug)
  if (!tenantSlug || !tenantId) {
    return {
      title: 'Not Found',
      description: 'Page not found',
    }
  }

  const safeSlug = normalizeSlug(slug)
  
  let page: AnyPageType | null = null

  try {
    page = await getPageBySlug(safeSlug, tenantSlug, false, false)
  } catch (error) {
    console.error('Error fetching page for metadata:', error)
  }

  // Fallback metadata if page not found
  if (!page) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    }
  }

  // Use the SEO utility function to generate metadata
  return generateSEOMetadata({
    title: page.meta?.title || page.title,
    description: page.meta?.description || undefined,
    image: page.meta?.image as Media | null | undefined,
  })
}

// eslint-disable-next-line no-restricted-exports
export default async function TenantSlugPage({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: {
  params: Promise<{ slug?: string[]; tenant: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  // Await parameters
  const params = await paramsPromise
  const searchParams = await searchParamsPromise
  const { slug, tenant: tenantSlug } = params

  // Get tenant ID and draft mode status
  const tenantId = await getTenantIdBySlug(tenantSlug)
  const { isEnabled: draft } = await draftMode()

  // Early return if tenant not found
  if (!tenantSlug || !tenantId) {
    return notFound()
  }

  // Normalize slug and query for the page
  const safeSlug = normalizeSlug(slug)
  const page = await getPageBySlug(safeSlug, tenantSlug, draft, draft)
  
  // If no page is found, return a 404
  if (!page) {
    return notFound()
  }

  // Fetch layout data in parallel
  const [navbarData, businessInfoData, footerData] = await Promise.all([
    getNavbar(tenantId),
    getBusinessInfo(tenantId),
    getFooter(tenantId),
  ])

  // Prepare Navbar props
  const logoLightUrl = await getLogoUrl(businessInfoData, 'light')
  const logoDarkUrl = await getLogoUrl(businessInfoData, 'dark')
  const companyName = businessInfoData?.companyName ?? 'Podjetje'
  const phoneNumber = businessInfoData?.phoneNumber ?? ''
  const email = businessInfoData?.email ?? ''
  const location = businessInfoData?.location ?? ''

  // Render the page layout blocks
  return (
    <>
      <Navbar 
        navbarData={navbarData}
        logoLightUrl={logoLightUrl}
        logoDarkUrl={logoDarkUrl}
        companyName={companyName}
        phoneNumber={phoneNumber}
        email={email}
        location={location}
      />
      {draft && <LivePreviewListener />}
      {renderPageBlocks(page, searchParams)}
      <Footer 
        footerData={footerData} 
        businessInfoData={businessInfoData} 
        navbarData={navbarData}
      /> 
    </>
  )
}
