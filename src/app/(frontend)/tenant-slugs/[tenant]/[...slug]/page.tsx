import type { Where } from 'payload'

import configPromise from '@payload-config'
import { headers as getHeaders, draftMode } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { queryPageBySlug } from '@/lib/payload'
import { LivePreviewListener } from '@/components/admin/live-preview-listener'

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
    const tenantsQuery = await payload.find({
      collection: 'tenants',
      overrideAccess: true,
      user,
      where: {
        slug: {
          equals: tenant,
        },
      },
    })
    
    // If no tenant is found, redirect to login
    if (tenantsQuery.docs.length === 0) {
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

  // Render the page layout blocks
  return (
    <>
      {draft && <LivePreviewListener />}
      <RenderBlocks blocks={page.layout} />
    </>
  )
}
