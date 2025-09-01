import type { CollectionConfig } from 'payload'

// import { createAccess } from './access/create'
// import { readAccess } from './access/read'
// import { updateAndDeleteAccess } from './access/updateAndDelete'
import { externalUsersLogin } from './endpoints/externalUsersLogin'
import { ensureUniqueUsername } from './hooks/ensureUniqueUsername'

import { setCookieBasedOnDomain } from './hooks/setCookieBasedOnDomain'
import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields'
import { isSuperAdmin, isSuperAdminAccess } from '@/access/isSuperAdminAccess'

const defaultTenantArrayField = tenantsArrayField({
  tenantsArrayFieldName: 'tenants',
  tenantsArrayTenantFieldName: 'tenant',
  tenantsCollectionSlug: 'tenants',
  arrayFieldAccess: {},
  tenantFieldAccess: {},
  rowFields: [
    {
      name: 'roles',
      type: 'select',
      defaultValue: ['tenant-viewer'],
      hasMany: true,
      options: ['tenant-admin', 'tenant-viewer'],
      required: true,
    },
  ],
})

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
    group: 'Konfiguracija',
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
      name: 'firstName',
      label: 'Ime',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      label: 'Priimek',
      type: 'text',
      required: true,
    },
    {
      name: 'address',
      label: 'Naslov',
      type: 'text',
    },
    {
      name: 'phoneNumber',
      label: 'Telefonska številka',
      type: 'text',
    },
    {
      name: 'vatId',
      label: 'Davčna številka',
      type: 'text',
    },
    {
      name: 'companyName',
      label: 'Naziv podjetja',
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
    {
      ...defaultTenantArrayField,
      admin: {
        ...(defaultTenantArrayField?.admin || {}),
        position: 'sidebar',
      },
    },
  ],
  // The following hook sets a cookie based on the domain a user logs in from.
  // It checks the domain and matches it to a tenant in the system, then sets
  // a 'payload-tenant' cookie for that tenant.

  hooks: {
    afterLogin: [setCookieBasedOnDomain],
  },
}

export default Users