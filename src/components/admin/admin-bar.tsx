'use client'
import type { PayloadAdminBarProps, PayloadMeUser } from '@payloadcms/admin-bar'
import { useRouter, useSelectedLayoutSegments } from 'next/navigation'
import { PayloadAdminBar } from '@payloadcms/admin-bar'
import React, { useState } from 'react'

import { cn } from '@/lib/utils'
import { getClientSideURL } from '@/utilities/getURL'

const collectionLabels = {
  pages: {
    plural: 'Pages',
    singular: 'Page',
  },
  posts: {
    plural: 'Posts',
    singular: 'Post',
  },
  projects: {
    plural: 'Projects',
    singular: 'Project',
  },
}

const Title: React.FC = () => <span className="font-semibold text-white">Dashboard</span>

export const AdminBar: React.FC<{
  adminBarProps?: PayloadAdminBarProps
}> = (props) => {
  const { adminBarProps } = props || {}
  const segments = useSelectedLayoutSegments()
  const [show, setShow] = useState(false)
  const collection = (
    collectionLabels[segments?.[1] as keyof typeof collectionLabels] ? segments[1] : 'pages'
  ) as keyof typeof collectionLabels
  const router = useRouter()

  const onAuthChange = React.useCallback((user: PayloadMeUser) => {
    setShow(Boolean(user?.id))
  }, [])

  return (
    <div
      className={cn(
        'w-full py-2 bg-black text-white shadow-md',
        show ? 'block' : 'hidden'
      )}
    >
      <div className="container mx-auto px-4">
        <PayloadAdminBar
          {...adminBarProps}
          className="py-2 text-white"
          classNames={{
            controls: 'font-medium text-white',
            logo: 'text-white',
            user: 'text-white',
          }}
          cmsURL={getClientSideURL()}
          collectionSlug={collection}
          collectionLabels={{
            plural: collectionLabels[collection]?.plural || 'Pages',
            singular: collectionLabels[collection]?.singular || 'Page',
          }}
          logo={<Title />}
          onAuthChange={onAuthChange}
          onPreviewExit={() => {
            fetch('/next/exit-preview').then(() => {
              router.push('/')
              router.refresh()
            })
          }}
          style={{
            backgroundColor: 'transparent',
            padding: 0,
            position: 'relative',
            zIndex: 'unset',
          }}
        />
      </div>
    </div>
  )
}

type GutterProps = {
  children: React.ReactNode
  className?: string
  left?: boolean
  right?: boolean
  ref?: React.Ref<HTMLDivElement>
}

export const Gutter: React.FC<GutterProps> = React.forwardRef<HTMLDivElement, GutterProps>(
  (props, ref) => {
    const { children, className, left = true, right = true } = props

    return (
      <div
        className={cn(
          'w-full mx-auto px-4 sm:px-6 lg:px-8',
          left && 'md:pl-4 lg:pl-6',
          right && 'md:pr-4 lg:pr-6',
          className
        )}
        ref={ref}
      >
        {children}
      </div>
    )
  }
)

Gutter.displayName = 'Gutter'
    