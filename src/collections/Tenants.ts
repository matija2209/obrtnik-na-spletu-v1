import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true, // Ensure tenant slugs are unique
      admin: {
        description: 'Unique identifier for the tenant, used in URLs etc.',
      },
    },
    // Add other tenant-specific fields here if needed
    // e.g., domain, logo, settings, etc.
  ],
} 