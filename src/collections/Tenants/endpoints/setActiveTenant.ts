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