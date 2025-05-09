import configPromise from '@payload-config'
import { headers as getHeaders, draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { queryPageBySlug, getNavbar, getBusinessInfo, getLogoUrl, getFooter, getTenantIdBySlug } from '@/lib/payload'
import { LivePreviewListener } from '@/components/admin/live-preview-listener'
import Footer from '@/components/layout/footer'
import Navbar from '@/components/layout/navbar'

// eslint-disable-next-line no-restricted-exports
export default async function TenantSlugPage({
  params: paramsPromise,
}: {
  params: Promise<{ slug?: string[]; tenant: string }>
}) {

  // Await parameters
  const params = await paramsPromise
  const { slug, tenant } = params

  // Get authenticated user
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  // Get draft mode status
  const { isEnabled: draft } = await draftMode()

  // Fetch global data in parallel

  const [navbarData, businessInfoData, footerData] = await Promise.all([
    getNavbar(tenant),
    getBusinessInfo(tenant),
    getFooter(tenant),
  ])
  // Query for the page, passing draft status
  const safeSlug = slug === undefined || slug.length === 0 ? ['home'] : slug;

  const page = await queryPageBySlug({
    slug: safeSlug,
    tenant,
    overrideAccess: draft,
    draft,
  })

  
  // If no page is found, return a 404
  if (!page) {
    return notFound()
  }

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
      <RenderBlocks blocks={page.layout} />
      <Footer 
        footerData={footerData} 
        businessInfoData={businessInfoData} 
        navbarData={navbarData}
      /> 
    </>
  )
}
