"use cache"
import configPromise from '@payload-config'
import { headers as getHeaders, draftMode } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
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
  console.log('TenantSlugPage', params);

  // Get authenticated user
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  // Check tenant access
  try {
    const tenantId = await getTenantIdBySlug(tenant)
    
    // If no tenant is found, redirect to login
    if (!tenantId) {
      redirect(
        `/tenant-slugs/${tenant}/login?redirect=${encodeURIComponent(
          `/tenant-slugs/${tenant}${slug ? `/${slug.join('/')}` : ''}`,
        )}`,
      )
    }
  } catch (e) {
    // If the query fails, redirect to login
    redirect(
      `/tenant-slugs/${tenant}/login?redirect=${encodeURIComponent(
        `/tenant-slugs/${tenant}${slug ? `/${slug.join('/')}` : ''}`,
      )}`,
    )
  }

  // Get draft mode status
  const { isEnabled: draft } = await draftMode()

  // Fetch global data in parallel
  const [navbarData, businessInfoData, footerData] = await Promise.all([
    getNavbar(),
    getBusinessInfo(),
    getFooter(),
  ])

  // Query for the page, passing draft status
  const page = await queryPageBySlug({
    slug,
    tenant,
    overrideAccess: draft,
    draft,
  })

  // If no page is found, return a 404
  if (!page) {
    return notFound()
  }

  // Prepare Navbar props
  const logoLightUrl = getLogoUrl(businessInfoData, 'light')
  const logoDarkUrl = getLogoUrl(businessInfoData, 'dark')
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
