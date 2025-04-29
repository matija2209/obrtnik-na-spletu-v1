import React from 'react'



// eslint-disable-next-line no-restricted-exports
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
