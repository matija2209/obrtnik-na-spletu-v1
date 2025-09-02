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