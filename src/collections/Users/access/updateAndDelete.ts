import type { Access } from 'payload'


import { isSuperAdmin, isSuperAdminAccess } from '@/access/isSuperAdminAccess'
import { isAccessingSelf } from './isAccessingSelf'

export const updateAndDeleteAccess: Access = ({ req, id }) => {
  const { user } = req

  if (!user) {
    return false
  }

  if (isSuperAdmin(user) || isAccessingSelf({ id, req })) {
    return true
  }
  return true
}