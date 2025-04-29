import type { Access } from 'payload'
import type { User } from '@payload-types' // Relative path
import { getUserTenantIDs } from '@/utilities/getUserTenantIDs' // Relative path
import { isSuperAdmin } from '@/access/isSuperAdminAccess'

export const createAccess: Access<User> = ({ req }) => {
  if (!req.user) {
    return false
  }

  if (isSuperAdmin(req.user)) {
    return true
  }

  // Use roles defined in the new Users collection tenant field ('admin', 'user')
  // Assuming 'admin' role within a tenant allows creating users for that tenant?
  // Or should this check top-level roles?
  // Let's assume for now that tenant-level 'admin' allows creation.
  const adminTenantAccessIDs = getUserTenantIDs(req.user, 'tenant-admin') // Changed role to 'admin'

  if (adminTenantAccessIDs.length) {
    return true
  }

  return false
} 