import { isSuperAdmin } from "@/access/isSuperAdminAccess"
import { isAccessingSelf } from "./isAccessingSelf"
import { Access, User, Where } from "payload"
import { getTenantFromCookie } from "@payloadcms/plugin-multi-tenant/utilities"
import { getCollectionIDType } from "@/utilities/getCollectionIDType"
import { getUserTenantIDs } from "@/utilities/getUserTenantIDs"
import { Tenant } from "@payload-types"

export const readAccess: Access<User> = ({ req, id }) => {
  if (!req?.user) {
    return false
  }

  if (isAccessingSelf({ id, req })) { // Pass correct args
    return true
  }

  const superAdmin = isSuperAdmin(req.user)
  const selectedTenant = getTenantFromCookie(
    req.headers,
    getCollectionIDType({ payload: req.payload, collectionSlug: 'tenants' }),
  )
  // Use 'admin' role for consistency with create.ts
  const adminTenantAccessIDs = getUserTenantIDs(req.user, 'tenant-admin') 

  if (selectedTenant) {
    // Explicitly type tenantId
    const hasTenantAccess = adminTenantAccessIDs.some((tenantId: Tenant['id']) => tenantId === selectedTenant)
    if (superAdmin || hasTenantAccess) {
      return {
        'tenants.tenant': {
          equals: selectedTenant,
        },
      }
    }
  }

  // Super admins can see all users
  if (superAdmin) {
    return true
  }

  // Regular users can see themselves OR users belonging to tenants they are admin of
  return {
    or: [
      {
        id: {
          equals: req.user.id,
        },
      },
      {
        'tenants.tenant': {
          in: adminTenantAccessIDs,
        },
      },
    ],
  } as Where
} 