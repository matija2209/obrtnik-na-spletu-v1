import type { CollectionConfig } from 'payload'
import { Access } from 'payload'

import type { User } from '@payload-types' // Corrected relative path

import { superAdminOrTenantAdminAccess } from '../access/superAdminOrTenantAdmin'

// Define stricter types for access control arguments
interface AccessArgs {
  req: {
    user?: User | null // Use your actual User type
  }
}

// Access Control Functions
const isLoggedIn: Access = ({ req }: AccessArgs) => !!req.user

const anyone = () => true

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  labels: {
    singular: 'Preusmeritev',
    plural: 'Preusmeritve',
  },
  admin: {
    useAsTitle: 'from',
    description: 'Upravljajte preusmeritve URL naslovov.',
    group: 'Konfiguracija',
    defaultColumns: ['from', 'to.type', 'updatedAt'],
  },
  access: {
    read: anyone, // Allow public read access
    create: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  fields: [
    {
      name: 'from',
      label: 'From Path',
      type: 'text',
      required: true,
      unique: true, // NOTE: For multi-tenant, uniqueness should ideally be scoped per tenant.
                 // The multi-tenant plugin might handle this, or you might need a custom hook/validation.
      index: true,
      admin: {
        description: 'The path to redirect from (e.g., /old-page). Must start with /.',
      },
      validate: (value: unknown): true | string => {
        if (typeof value !== 'string' || !value.startsWith('/')) {
          return 'Path must start with / and be a string.'
        }
        // Add check for spaces or other invalid characters if needed
        if (/\s/.test(value)) {
           return 'Path cannot contain spaces.'
        }
        return true
      },
    },
    {
      name: 'to',
      label: 'To Path or URL',
      type: 'text',
      required: true,
      admin: {
        description: 'The path or URL to redirect to (e.g., /new-page or https://example.com). Must start with / or http(s)://.',
      },
      validate: (value: unknown): true | string => {
        if (typeof value !== 'string') {
           return 'Redirect target must be a string.'
        }
        const isRelativePath = value.startsWith('/')
        const isAbsoluteUrl = value.startsWith('http://') || value.startsWith('https://')

        if (!isRelativePath && !isAbsoluteUrl) {
          return 'Must be a relative path starting with / or an absolute URL starting with http(s)://.'
        }

        // Optional: Add check for spaces in relative paths
        if (isRelativePath && /\s/.test(value)) {
          return 'Relative path cannot contain spaces.'
        }

        // Optional: Add more robust URL validation if needed
        // try {
        //   if (isAbsoluteUrl) new URL(value)
        // } catch (e) {
        //   return 'Invalid URL format.'
        // }

        return true
      },
    },
    // Add the tenant field required by the multi-tenant plugin
    // If your multi-tenant plugin adds this automatically, you might not need it explicitly defined here.
    // However, defining it makes the relationship clear.
    // {
    //   name: 'tenant',
    //   type: 'relationship',
    //   relationTo: 'tenants',
    //   required: true,
    //   index: true,
    //   // Adjust access control based on multi-tenant plugin specifics
    //   access: {
    //     create: () => true, // Should be set by plugin or hooks
    //     update: () => false, // Typically shouldn't change tenant
    //   },
    //   admin: {
    //     readOnly: true, // Make read-only in admin UI after creation
    //     position: 'sidebar',
    //   }
    // },
    // If you need a slug for some reason (unlikely for redirects), uncomment this:
    // slugField('from'),
  ],
} 