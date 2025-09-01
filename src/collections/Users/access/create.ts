import type { Access } from 'payload'
import type { User } from '@payload-types' // Relative path

import { isSuperAdmin } from '@/access/isSuperAdminAccess'

export const createAccess: Access<User> = ({ req }) => {
  if (!req.user) {
    return false
  }

  return true
} 