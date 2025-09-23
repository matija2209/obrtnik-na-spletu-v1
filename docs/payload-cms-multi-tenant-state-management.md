# Managing Active Tenant State in Payload CMS Multi-Tenant Applications with Next.js Cookies

I was deep into building a multi-tenant SaaS platform with Payload CMS when I hit a frustrating wall. The `@payloadcms/plugin-multi-tenant` plugin handled the data isolation beautifully, but I couldn't figure out where to store the "current active tenant" state. My admin users needed to switch between multiple tenants they managed, and every approach I tried had serious flaws.

Storing it in the database felt like overkill for what's essentially session data. Client-side state disappeared on page refreshes and wasn't accessible server-side where I needed it most. Local storage couldn't be read during server-side rendering or in middleware. After wrestling with this for days, I discovered that Next.js cookies were the perfect solution - server-side accessible, persistent across requests, and lightweight enough for real-time tenant switching.

This guide walks you through implementing a robust active tenant state management system that works seamlessly with Payload CMS multi-tenant architecture, from the backend utilities to the admin interface components.

## The Challenge with Payload CMS Multi-Tenant State

When you're building with Payload CMS and the multi-tenant plugin, you quickly realize that while the plugin handles data isolation perfectly, it doesn't solve the problem of tracking which tenant a user is currently working with. Most tutorials and examples hardcode tenant access like `user.tenants[0]`, which breaks down immediately when users manage multiple tenants.

I needed a solution that could:
- Persist across server-side operations and page refreshes
- Be accessible in middleware for request routing
- Work with Payload globals and collections seamlessly
- Provide a clean admin interface for tenant switching
- Handle fallback scenarios gracefully

The answer turned out to be Next.js cookies combined with a smart priority system.

## Building the Cookie-Based Tenant State System

The foundation of this approach is a utility function that implements a smart fallback hierarchy for determining the active tenant. This ensures your application always knows which tenant context to operate in, even when users haven't explicitly selected one.

```typescript
// File: src/utilities/getActiveTenant.ts
import type { PayloadRequest } from 'payload'
import type { Tenant, User } from '@payload-types'

/**
 * Gets the active tenant for the current user based on cookies and user permissions
 * Priority: active-tenant cookie > payload-tenant cookie > first user tenant
 */
export const getActiveTenant = async (req: PayloadRequest): Promise<Tenant | null> => {
  if (!req.user || !req.user.tenants) {
    return null
  }

  // Helper function to get cookie value
  const getCookie = (name: string): string | null => {
    const cookies = req.headers?.get('cookie') || ''
    const match = cookies.match(new RegExp(`(^| )${name}=([^;]+)`))
    return match ? match[2] : null
  }

  // Try active-tenant cookie first (user-selected)
  let targetTenantId = getCookie('active-tenant')
  
  // Fallback to payload-tenant cookie (domain-based)
  if (!targetTenantId) {
    targetTenantId = getCookie('payload-tenant')
  }

  // If we have a target tenant ID, verify user has access and fetch it
  if (targetTenantId) {
    const hasAccess = req.user.tenants.some(({ tenant }) => {
      const id = typeof tenant === 'object' ? tenant.id : tenant
      return String(id) === String(targetTenantId)
    })

    if (hasAccess) {
      try {
        const tenantDoc = await req.payload.findByID({
          collection: 'tenants',
          id: targetTenantId,
        })
        return tenantDoc
      } catch (error) {
        req.payload.logger.error({ err: error }, 'Error fetching active tenant by ID')
      }
    }
  }

  // Fallback: use first tenant from user's tenant list
  if (req.user.tenants.length > 0) {
    try {
      const firstTenant = req.user.tenants[0].tenant
      const tenantId = typeof firstTenant === 'object' ? firstTenant.id : firstTenant
      
      const tenantDoc = await req.payload.findByID({
        collection: 'tenants',
        id: tenantId,
      })
      return tenantDoc
    } catch (error) {
      req.payload.logger.error({ err: error }, 'Error fetching fallback tenant')
    }
  }

  return null
}

/**
 * Gets the active tenant slug - convenience function
 */
export const getActiveTenantSlug = async (req: PayloadRequest): Promise<string> => {
  const tenant = await getActiveTenant(req)
  return tenant?.slug || 'default'
}
```

This utility implements a three-tier priority system that ensures your Payload CMS multi-tenant application always has a valid tenant context. The `active-tenant` cookie takes precedence when users explicitly select a tenant, while the `payload-tenant` cookie serves as a domain-based fallback, and the user's first tenant provides the ultimate safety net.

The beauty of this approach is that it works seamlessly with both Payload globals and collections. Any server-side operation can call `getActiveTenant(req)` to get the current tenant context, making it perfect for access control, data filtering, and preview functionality.

## Creating the Backend Endpoint for Tenant Selection

To allow users to switch their active tenant, you need an endpoint that can set the `active-tenant` cookie securely. This endpoint handles authentication, permission verification, and cookie management in one clean operation.

```typescript
// File: src/collections/Tenants/endpoints/setActiveTenant.ts
import type { PayloadRequest, Endpoint } from 'payload'
import { generateCookie, getCookieExpiration, mergeHeaders } from 'payload'

export const setActiveTenant: Endpoint = {
  path: '/set-active/:tenantId',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    const { tenantId } = req.routeParams || {}
    
    if (!tenantId) {
      return Response.json({ error: 'Tenant ID is required' }, { status: 400 })
    }

    // Verify user has access to this tenant
    if (!req.user || !req.user.tenants) {
      return Response.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const hasAccess = req.user.tenants.some(({ tenant }) => {
      const id = typeof tenant === 'object' ? tenant.id : tenant
      return String(id) === String(tenantId)
    })

    if (!hasAccess) {
      return Response.json({ error: 'No access to this tenant' }, { status: 403 })
    }

    // Set the active-tenant cookie
    const tenantCookie = generateCookie({
      name: 'active-tenant',
      value: String(tenantId),
      expires: getCookieExpiration({ seconds: 30 * 24 * 60 * 60 }), // 30 days
      path: '/',
      returnCookieAsObject: false,
    })

    // Set response headers
    const headers = new Headers({
      'Set-Cookie': tenantCookie as string,
    })

    req.responseHeaders = req.responseHeaders
      ? mergeHeaders(req.responseHeaders, headers)
      : headers

    return Response.json({ 
      success: true, 
      message: 'Active tenant updated',
      tenantId 
    })
  },
}
```

This endpoint leverages Payload's built-in cookie utilities to ensure proper security headers and expiration settings. The 30-day expiration means users won't lose their tenant selection between sessions, while the path setting ensures the cookie is available across your entire admin interface.

Next, register this endpoint in your Tenants collection configuration:

```typescript
// File: src/collections/Tenants/index.ts
import { setActiveTenant } from './endpoints/setActiveTenant'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  // ... other configuration
  endpoints: [setActiveTenant],
  // ... rest of configuration
}
```

The endpoint integrates seamlessly with Payload's existing authentication and permission system, ensuring that users can only switch to tenants they actually have access to. This maintains the security model of your multi-tenant application while providing the flexibility users need.

## Building the Admin Interface Component

The admin interface component provides a clean, intuitive way for users to see their current tenant status and switch when needed. This component uses Payload's native UI components to maintain consistency with the rest of the admin interface.

```typescript
// File: src/collections/Tenants/components/ActiveTenantSelector.tsx
'use client'

import React, { useState } from 'react'
import { useConfig, useAuth, Button, toast, useDocumentInfo } from '@payloadcms/ui'

interface Tenant {
  id: string | number
  name: string
  slug: string
}

const ActiveTenantSelector: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { config } = useConfig()
  const { user } = useAuth()
  const { id } = useDocumentInfo()

  // Get current active tenant from cookie
  const getActiveTenantId = () => {
    if (typeof document === 'undefined') return null
    const cookies = document.cookie.split(';')
    const activeTenantCookie = cookies.find(cookie => 
      cookie.trim().startsWith('active-tenant=')
    )
    return activeTenantCookie ? activeTenantCookie.split('=')[1] : null
  }

  const activeTenantId = getActiveTenantId()
  const currentTenantId = String(id)
  const isCurrentTenantActive = activeTenantId === currentTenantId

  // Check if user has access to this tenant
  const hasAccess = user?.tenants?.some(({ tenant }) => {
    const tenantId = typeof tenant === 'object' ? tenant.id : tenant
    return String(tenantId) === currentTenantId
  })

  if (!user || !hasAccess) {
    return null // Don't show component if user doesn't have access
  }

  const handleSetActive = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch(`${config.serverURL}/api/tenants/set-active/${currentTenantId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        toast.success(`Active tenant updated successfully`)
        // Refresh the page to update the UI
        window.location.reload()
      } else {
        toast.error('Failed to set active tenant')
      }
    } catch (error) {
      console.error('Error setting active tenant:', error)
      toast.error('Error setting active tenant')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ 
      padding: '12px', 
      backgroundColor: '#f9f9f9', 
      border: '1px solid #e0e0e0',
      borderRadius: '4px',
      marginBottom: '16px'
    }}>
      <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Active Tenant Status</h4>
      
      {isCurrentTenantActive ? (
        <div style={{ color: '#22c55e', fontSize: '12px' }}>
          ● This is your currently ACTIVE tenant
        </div>
      ) : (
        <div>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
            This tenant is not currently active
          </div>
          <Button
            onClick={handleSetActive}
            disabled={isLoading}
            size="small"
            buttonStyle="primary"
          >
            {isLoading ? 'Setting as Active...' : 'Make This Tenant Active'}
          </Button>
        </div>
      )}
    </div>
  )
}

export default ActiveTenantSelector
```

This component uses `useDocumentInfo()` to get the current tenant's ID from the URL, then compares it against the active tenant cookie to determine the current state. The component only renders for users who have access to the current tenant, maintaining security while providing a clean interface.

To integrate this component into your Tenants collection, add it as a UI field in the sidebar:

```typescript
// File: src/collections/Tenants/index.ts (field configuration)
{
  name: 'activeTenantActions',
  type: 'ui',
  admin: {
    position: 'sidebar',
    components: {
      Field: '@/collections/Tenants/components/ActiveTenantSelector#default',
    },
  },
},
```

The UI field type is perfect for this use case because it doesn't affect your database schema while providing the interactive functionality users need. After adding the component, run `npm run generate:importmap` to register it with Payload's import system.

## Integrating with Payload CMS Preview and Globals

One of the most powerful applications of this cookie-based tenant state system is integrating it with Payload's preview functionality. When users preview content, they expect it to reflect the tenant context they're currently working in.

```typescript
// File: src/app/(frontend)/next/preview/route.ts
import { getActiveTenantSlug } from '@/utilities/getActiveTenant'

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = request.nextUrl
  const path = searchParams.get('path') || '/'
  const secret = searchParams.get('secret')

  // Validate secret and authenticate user
  const user = await payload.auth({ req: request })
  
  if (!user.user) {
    draft.disable()
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  // Extract active tenant slug using the new utility
  // This respects user's active tenant selection via cookies
  let tenantSlug = 'default' // fallback
  
  try {
    tenantSlug = await getActiveTenantSlug(request as unknown as PayloadRequest)
  } catch (error) {
    payload.logger.error({ err: error }, 'Error fetching active tenant for preview')
    // tenantSlug remains 'default'
  }

  draft.enable()

  // Construct the tenant-specific path
  const redirectPath = `/tenant-slugs/${tenantSlug}${path}`

  redirect(redirectPath)
}
```

This integration ensures that when users click "Preview" in the admin interface, they see the content in the context of their currently selected tenant. The preview respects the cookie-based tenant selection automatically, without requiring any additional configuration.

The same pattern works beautifully with Payload globals. You can use `getActiveTenant()` in your globals access functions to ensure that global content like site settings, navigation, or theme configurations are tenant-aware:

```typescript
// Example: Tenant-aware globals access
access: {
  read: async ({ req }) => {
    const activeTenant = await getActiveTenant(req)
    return activeTenant ? { tenant: { equals: activeTenant.id } } : false
  }
}
```

This approach makes your entire Payload CMS multi-tenant application consistent, ensuring that every operation respects the user's current tenant context.

## Middleware Integration and Advanced Usage

The cookie-based approach shines when integrated with Next.js middleware, where you need reliable access to tenant context for routing decisions and request processing. Since cookies are available in middleware through the request headers, you can make tenant-aware routing decisions at the edge.

```typescript
// File: src/middleware.ts (example integration)
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const activeTenantCookie = req.cookies.get('active-tenant')
  const tenantId = activeTenantCookie?.value

  if (tenantId) {
    // Use tenant context for routing decisions
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('X-Active-Tenant-ID', tenantId)
    
    return NextResponse.next({
      request: { headers: requestHeaders }
    })
  }

  // Handle requests without active tenant
  return NextResponse.next()
}
```

This middleware pattern allows you to pass tenant context through to your application routes, making it available for server-side operations, API routes, and page components. The `X-Active-Tenant-ID` header can then be read by your Payload operations to ensure consistent tenant context throughout your application.

For Payload globals that need to be tenant-aware, you can create helper functions that automatically apply the active tenant context:

```typescript
// File: src/utilities/tenantAwareGlobals.ts
export const getActiveTenantGlobal = async (
  globalSlug: string, 
  req: PayloadRequest
) => {
  const activeTenant = await getActiveTenant(req)
  
  if (!activeTenant) {
    throw new Error('No active tenant found')
  }

  return await req.payload.findGlobal({
    slug: globalSlug,
    where: {
      tenant: { equals: activeTenant.id }
    }
  })
}
```

This pattern ensures that your PayloadCMS multi-tenant plugin integration remains consistent across globals, collections, and custom operations.

## Conclusion

Managing active tenant state in Payload CMS multi-tenant applications doesn't have to be complicated. By leveraging Next.js cookies as the storage mechanism, you get the perfect balance of persistence, server-side accessibility, and lightweight implementation. The cookie-based approach integrates seamlessly with Payload's multi-tenant plugin architecture, providing reliable tenant context for globals, collections, preview functionality, and middleware operations.

This solution eliminates the common pitfalls of hardcoded tenant access while providing users with an intuitive interface for switching between the tenants they manage. The smart fallback hierarchy ensures your application always has valid tenant context, even when cookies are missing or invalid.

You now have a robust foundation for building multi-tenant applications with Payload CMS that scale with your users' needs. The cookie-based state management works across server and client boundaries, making it perfect for the complex requirements of modern multi-tenant SaaS applications.

Let me know in the comments if you have questions about implementing this in your own Payload CMS multi-tenant project, and subscribe for more practical development guides.

Thanks, Matija