import { Tenant } from '@payload-types';
import Link from 'next/link'
import { AdminViewServerProps } from 'payload'
import React from 'react'

function PreviewSite(props:AdminViewServerProps) {
  const {user} = props

  const tenantSlug = user?.tenants?.[0]?.tenant;
  const url = (tenantSlug && typeof tenantSlug === 'object' && 'slug' in tenantSlug) 
    ? `/tenant-slugs/${(tenantSlug as Tenant).slug}`
    : '#';

  return (
    <Link href={url} target="_blank" rel="noopener noreferrer" className='bg-blue-500 text-white px-4 py-2 rounded-md'>
      Ogled spletne strani
    </Link>
  )
}

export default PreviewSite