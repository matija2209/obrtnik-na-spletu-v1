import type { Access } from 'payload'

import { isSuperAdmin } from '@/access/isSuperAdminAccess'

export const deleteAccess: Access = ({ req }) => {
  if (!req.user) {
    return false
  }

  if (isSuperAdmin(req.user)) {
    return true
  }

  return false
} 