import type { Tenant, User } from '../../payload-types' // Adjust path as needed
// Use the more specific Config import path if needed
import type { Config } from '../../payload-types' 
import type { CollectionSlug } from 'payload'

/**
 * Extracts the ID from a document or an ID string/number (Generic Version)
 */
export const extractID = <T extends Config['collections'][CollectionSlug]>(
  objectOrID: T | T['id'],
): T['id'] => {
  if (objectOrID && typeof objectOrID === 'object') return objectOrID.id

  return objectOrID
}

/**
 * Returns array of all tenant IDs assigned to a user
 *
 * @param user - User object with tenants field
 * @param role - Optional role to filter by
 */
export const getUserTenantIDs = (
  user: null | User,
  role?: NonNullable<User['tenants']>[number]['roles'][number],
): Tenant['id'][] => {
  if (!user || !user.tenants) {
    return []
  }

  return (
    user.tenants.reduce<Tenant['id'][]>((acc, { roles, tenant }) => {
      if (role && (!roles || !roles.includes(role))) {
        return acc
      }

      if (tenant) {
        // Use the generic extractID
        const tenantId = extractID(tenant);
        if (tenantId !== undefined && tenantId !== null) {
          // This should now work as Tenant['id'] type is preserved
          acc.push(tenantId);
        }
      }

      return acc
    }, []) || []
  )
} 