import type { CollectionConfig } from 'payload'

// import { createAccess } from './access/create'
// import { readAccess } from './access/read'
// import { updateAndDeleteAccess } from './access/updateAndDelete'
import { externalUsersLogin } from './endpoints/externalUsersLogin'
import { ensureUniqueUsername } from './hooks/ensureUniqueUsername'



import { isSuperAdmin, isSuperAdminAccess } from '@/access/isSuperAdminAccess'

const Users: CollectionConfig = {
  slug: 'users',
  access: {
    create: isSuperAdminAccess,
    delete: isSuperAdminAccess,
    read: isSuperAdminAccess,
    update: isSuperAdminAccess,
  },
  admin: {
    useAsTitle: 'email',
    group: 'Nastavitve',
  },
  labels: {
    singular: 'Uporabnik',
    plural: 'Uporabniki',
  },
  auth: {
    useAPIKey: true,
  },
  endpoints: [externalUsersLogin],
  fields: [
    {
      name: 'username',
      type: 'text',
      hooks: {
        beforeValidate: [ensureUniqueUsername],
      },
      index: true,
    },
    {
      name: 'first_name',
      label: 'Ime',
      type: 'text',
      required: true,
    },
    {
      name: 'last_name',
      label: 'Priimek',
      type: 'text',
      required: true,
    },
    {
      name: 'phone_number',
      label: 'Telefonska številka',
      type: 'text',
    },
    {
      admin: {
        position: 'sidebar',
      },
      name: 'roles',
      type: 'select',
      defaultValue: ['user'],
      hasMany: true,
      options: ['super-admin', 'user'],
      access: {
        update: ({ req }) => {
          return isSuperAdmin(req.user)
        },
        create: ({ req }) => {
          return isSuperAdmin(req.user)
        },
      },
    },
  ],
  // The following hook sets a cookie based on the domain a user logs in from.
  // It checks the domain and matches it to a tenant in the system, then sets
  // a 'payload-tenant' cookie for that tenant.
}

export default Users