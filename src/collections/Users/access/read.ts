import { isSuperAdmin } from "@/access/isSuperAdminAccess"
import { isAccessingSelf } from "./isAccessingSelf"
import { Access, User, Where } from "payload"
import { getTenantFromCookie } from "@payloadcms/plugin-multi-tenant/utilities"
import { getCollectionIDType } from "@/utilities/getCollectionIDType"



export const readAccess: Access<User> = ({ req, id }) => {
  if (!req?.user) {
    return false
  }

  if (isAccessingSelf({ id, req })) { // Pass correct args
    return true
  }

  const superAdmin = isSuperAdmin(req.user)

  // Use 'admin' role for consistency with create.ts

  // Super admins can see all users
  if (superAdmin) {
    return true
  }


  return true

} 