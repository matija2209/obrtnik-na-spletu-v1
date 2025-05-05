import type { CollectionConfig } from 'payload'

import { updateAccess } from './access/update'
import { deleteAccess } from './access/delete'
import { isSuperAdminAccess } from '@/access/isSuperAdminAccess'
import afterChangeHook from './hooks/afterChange'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  access: {
    create: isSuperAdminAccess,
    delete: deleteAccess,
    read: ()=>true,
    update: updateAccess,
  },
  admin: {
    useAsTitle: 'name',
  },
  hooks: {
    afterChange: [afterChangeHook],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'domain',
      type: 'text',
      admin: {
        description: 'Used for domain-based tenant handling',
      },
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        description: 'Used for url paths, example: /tenant-slug/page-slug',
      },
      index: true,
      required: true,
      unique: true,
    },
    {
      name: 'colors',
      label: 'Theme Colors',
      type: 'group',
      admin: {
        description: 'Define the color palette for this tenant.',
        components: {
          Field: '/collections/Tenants/fields/tenant-fields',
        },
      },
      fields: [
        {
          name: 'primary',
          label: 'Primary Color',
          type: 'text',
          defaultValue: 'oklch(0.82 0.1663 83.77)',
        },
        {
          name: 'primaryForeground',
          label: 'Primary Foreground Color',
          type: 'text',
          defaultValue: 'oklch(0.985 0 0)',
        },
        {
          name: 'secondary',
          label: 'Secondary Color',
          type: 'text',
          defaultValue: 'oklch(0.32 0.1025 253.89)',
        },
        {
          name: 'secondaryForeground',
          label: 'Secondary Foreground Color',
          type: 'text',
          defaultValue: 'oklch(0.98 0.005 0)',
        },
        {
          name: 'accent', 
          label: 'Accent Color',
          type: 'text',
          defaultValue: 'oklch(0.77 0.1687 67.36)',
        },
        {
          name: 'accentForeground',
          label: 'Accent Foreground Color',
          type: 'text',
          defaultValue: 'oklch(0.205 0 0)',
        },
        {
          name: 'background', 
          label: 'Background Color',
          type: 'text',
          defaultValue: 'oklch(1 0 0)',
        },
        {
          name: 'foreground',
          label: 'Foreground Color (Text)',
          type: 'text',
          defaultValue: 'oklch(0.145 0 0)',
        },
      ],
    },
    {
      name: 'typography',
      label: 'Theme Typography',
      type: 'group',
      admin: {
        description: 'Define fonts and weights for this tenant.',
      },
      fields: [
        {
          name: 'displayFont',
          label: 'Display Font Family',
          type: 'text',
          defaultValue: 'Inter, system-ui, sans-serif', 
        },
        {
          name: 'bodyFont',
          label: 'Body Font Family',
          type: 'text',
          defaultValue: 'Inter, system-ui, sans-serif',
        },
        {
          name: 'headingWeight',
          label: 'Heading Font Weight',
          type: 'text', 
          defaultValue: '700',
        },
        {
          name: 'bodyWeight',
          label: 'Body Font Weight',
          type: 'text',
          defaultValue: '400',
        },
      ],
    },
    {
      name: 'radius',
      label: 'Border Radius',
      type: 'text',
      defaultValue: '0.625rem',
      admin: {
        description: 'Controls the roundness of elements (e.g., buttons, cards). Use rem, px, etc.'
      }
    },
    {
      name: 'allowPublicRead',
      type: 'checkbox',
      admin: {
        description:
          'If checked, logging in is not required to read. Useful for building public pages.',
        position: 'sidebar',
      },
      defaultValue: false,
      index: true,
    },
  ],
}