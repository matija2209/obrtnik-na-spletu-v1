import type { Metadata } from 'next'



import React from 'react'



import { draftMode } from 'next/headers'

import './globals.css'
import { AdminBar } from '@/components/admin/admin-bar'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html lang="sl" suppressHydrationWarning>
      <head>

        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
      <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          {children}

      </body>
    </html>
  )
}
