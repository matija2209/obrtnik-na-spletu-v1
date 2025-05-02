import type { Where } from 'payload'

import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { queryPageBySlug } from '@/lib/payload'

// eslint-disable-next-line no-restricted-exports
export default async function Page({
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

  // Query for the page
  const page = await queryPageBySlug({
    slug,
    tenant,
    overrideAccess: false, // Use access control
  })

  // If no page is found, return a 404
  if (!page) {
    return notFound()
  }

  // Render the page layout blocks
  return page.layout ? (
    <RenderBlocks blocks={page.layout} />
  ) : (
    <div>This page has no content blocks</div>
  )
}
