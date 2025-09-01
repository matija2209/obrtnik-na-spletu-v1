import type { CollectionAfterLoginHook } from 'payload'
import { mergeHeaders, generateCookie, getCookieExpiration } from 'payload'

export const setCookieBasedOnDomain: CollectionAfterLoginHook = async ({ req, user, token /* Added token */ }) => {
  // Check if headers exist and get host
  const host = req.headers?.get('host');
  if (!host) {
    req.payload.logger.warn('Could not determine host from request headers in setCookieBasedOnDomain hook.')
    return user; // Or return modified response if needed
  }

  const relatedOrg = await req.payload.find({
    collection: 'tenants',
    depth: 0,
    limit: 1,
    where: {
      domain: {
        equals: host,
      },
    },
  })

  // If a matching tenant is found, set the 'payload-tenant' cookie
  if (relatedOrg && relatedOrg.docs.length > 0) {
    const tenantCookie = generateCookie({
      name: 'payload-tenant',
      // Use a consistent expiration (e.g., 2 hours)
      expires: getCookieExpiration({ seconds: 7200 }),
      path: '/',
      returnCookieAsObject: false,
      value: String(relatedOrg.docs[0].id),
      // Consider adding httpOnly and secure flags for production
      // httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
    })

    // Merge existing responseHeaders with the new Set-Cookie header
    const newHeaders = new Headers({
      'Set-Cookie': tenantCookie as string,
    })

    // Ensure you merge existing response headers if they already exist
    req.responseHeaders = req.responseHeaders
      ? mergeHeaders(req.responseHeaders, newHeaders)
      : newHeaders
  }

  return user
} 