import type { Where } from 'payload'

import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { headers as getHeaders } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'
import { queryPageBySlug } from '@/lib/payload'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { LivePreviewListener } from '@/components/admin/live-preview-listener'




// eslint-disable-next-line no-restricted-exports
export default async function TenantDomainPage({
  params: paramsPromise,
}: {
  params: Promise<{ slug?: string[]; tenant: string }>
}) {
  const params = await paramsPromise
  let slug = undefined
  if (params?.slug) {
    // remove the domain route param
    params.slug.splice(0, 1)
    slug = params.slug
  }

  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  try {
    const tenantsQuery = await payload.find({
      collection: 'tenants',
      overrideAccess: true,
      user,
      where: {
        domain: {
          equals: params.tenant,
        },
      },
    })

    // If no tenant is found, the user does not have access
    // Show the login view
    if (tenantsQuery.docs.length === 0) {
      redirect(
        `/tenant-domains/login?redirect=${encodeURIComponent(
          `/tenant-domains${slug ? `/${slug.join('/')}` : ''}`,
        )}`,
      )
    }
  } catch (e) {
    // If the query fails, it means the user did not have access to query on the domain field
    // Show the login view
    redirect(
      `/tenant-domains/login?redirect=${encodeURIComponent(
        `/tenant-domains${slug ? `/${slug.join('/')}` : ''}`,
      )}`,
    )
  }

  // Get draft mode status
  const { isEnabled: draft } = await draftMode()

  // Query for the page, passing draft status
  const page = await queryPageBySlug({
    slug,
    tenant: params.tenant, // Use the domain as the tenant identifier for querying
    overrideAccess: draft,
    draft,
  })

  // If no page is found, return a 404
  if (!page) {
    return notFound()
  }

  // The page was found, render the page with data
  return (
    <>
      {draft && <LivePreviewListener />}
      <RenderBlocks blocks={page.layout} />
    </>
  )
}
