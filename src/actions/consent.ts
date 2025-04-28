// actions/consent.ts
'use server'

import { cookies } from 'next/headers'

export async function setCookieConsent(consent: boolean) {
  const cookieStore = await cookies()
  
  // Set cookie with a long expiration (1 year)
  cookieStore.set('cookie-consent', consent ? 'true' : 'false', {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
  })
  
  return true
}