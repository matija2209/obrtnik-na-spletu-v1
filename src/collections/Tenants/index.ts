import type { CollectionConfig } from 'payload'

import { updateAccess } from './access/update'
import { deleteAccess } from './access/delete'
import { isSuperAdminAccess, isSuperAdmin } from '@/access/isSuperAdminAccess'
import afterChangeHook from './hooks/afterChange'
import afterOperationHook from './hooks/afterOperation'
import afterDeleteHook from './hooks/afterDelete'


export const Tenants: CollectionConfig = {
  slug: 'tenants',
  access: {
    create: isSuperAdminAccess,
    delete: isSuperAdminAccess,
    read: ()=>true,
    update: updateAccess,
  },
  labels:{
    singular:"Spletno mesto",
    plural:"Spletna mesta"
  },
  admin: {
    useAsTitle: 'name',
    group: 'Struktura',
    components:{
      // beforeList: ['/components/admin/collections/tenants/populate-with-ai.tsx'],
      edit:{
        beforeDocumentControls:['/components/admin/collections/tenants/populate-with-ai.tsx'],
      }
    },
    defaultColumns:["name","domain","updatedAt"],
  },
  hooks: {
    afterOperation: [afterOperationHook],
    afterChange: [afterChangeHook],
    afterDelete: [afterDeleteHook],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Splošno',
          fields: [
            {
              name: 'name',
              label: 'Ime',
              type: 'text',
              required: true,
              access: {
                update: ({ req }) => isSuperAdmin(req.user),
              },
            },
            {
              name: 'domain',
              label: 'Domena',
              type: 'text',
              admin: {
                description: 'Used for domain-based tenant handling',
              },
              access: {
                update: ({ req }) => isSuperAdmin(req.user),
              },
            },
            {
              name: 'slug',
              label: 'Pot',
              type: 'text',
              admin: {
                description: 'Used for url paths, example: /tenant-slug/page-slug',
              },
              index: true,
              required: true,
              unique: true,
              access: {
                update: ({ req }) => isSuperAdmin(req.user),
              },
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
        },
        {
          label: 'Videz',
          fields: [
            {
              name: 'colors',
              label: 'Barve teme',
              type: 'group',
              admin: {
                description: 'Define the color palette for this tenant.',
              },
              fields: [
                {
                  name: 'primary',
                  label: 'Primarna barva',
                  type: 'text',
                  defaultValue: 'oklch(0.82 0.1663 83.77)',
                  admin:{
                    components:{
                      Field: '/collections/Tenants/fields/tenant-fields',
                    }
                  }
                },
                {
                  name: 'primaryForeground',
                  label: 'Primarna barva besedila',
                  type: 'text',
                  defaultValue: 'oklch(0.985 0 0)',
                  admin:{
                    components:{
                      Field: '/collections/Tenants/fields/tenant-fields',
                    }
                  }
                },
                {
                  name: 'secondary',
                  label: 'Sekundarna barva',
                  type: 'text',
                  defaultValue: 'oklch(0.32 0.1025 253.89)',
                  admin:{
                    components:{
                      Field: '/collections/Tenants/fields/tenant-fields',
                    }
                  }
                },
                {
                  name: 'secondaryForeground',
                  label: 'Sekundarna barva besedila',
                  type: 'text',
                  defaultValue: 'oklch(0.98 0.005 0)',
                  admin:{
                    components:{
                      Field: '/collections/Tenants/fields/tenant-fields',
                    }
                  }
                },
                {
                  name: 'accent',
                  label: 'Barva poudarka',
                  type: 'text',
                  defaultValue: 'oklch(0.77 0.1687 67.36)',
                  admin:{
                    components:{
                      Field: '/collections/Tenants/fields/tenant-fields',
                    }
                  }
                },
                {
                  name: 'accentForeground',
                  label: 'Barva besedila poudarka',
                  type: 'text',
                  defaultValue: 'oklch(0.205 0 0)',
                  admin:{
                    components:{
                      Field: '/collections/Tenants/fields/tenant-fields',
                    }
                  }
                },
                {
                  name: 'background',
                  label: 'Barva ozadja',
                  type: 'text',
                  defaultValue: 'oklch(1 0 0)',
                  admin:{
                    components:{
                      Field: '/collections/Tenants/fields/tenant-fields',
                    }
                  }
                },
                {
                  name: 'foreground',
                  label: 'Barva besedila',
                  type: 'text',
                  defaultValue: 'oklch(0.145 0 0)',
                  admin:{
                    components:{
                      Field: '/collections/Tenants/fields/tenant-fields',
                    }
                  }
                },
              ],
            },
            {
              name: 'radius',
              label: 'Radij okvirja',
              type: 'text',
              defaultValue: '0.625rem',
              admin: {
                description: 'Controls the roundness of elements (e.g., buttons, cards). Use rem, px, etc.'
              }
            },
          ],
        },
        {
          label: 'Tipografija',
          fields: [
            {
              name: 'typography',
              label: 'Tipografija',
              type: 'group',
              admin: {
                description: 'Define fonts, weights, and subsets for this tenant. These will be used with next/font/google.',
              },
              fields: [
                {
                  name: 'headingFont',
                  type: 'group',
                  label: 'Pisava naslovov',
                  fields: [
                    {
                      name: 'name',
                      label: 'Ime pisave',
                      type: 'select',
                      required: true,
                      defaultValue: 'Inter',
                      options: [
                        { label: 'Inter', value: 'Inter' },
                        { label: 'Roboto', value: 'Roboto' },
                        { label: 'Open Sans', value: 'Open_Sans' },
                        { label: 'Lato', value: 'Lato' },
                        { label: 'Montserrat', value: 'Montserrat' },
                      ],
                      admin: { description: "Select a Google Font. Ensure it matches the 'next/font/google' import name (e.g., 'Open_Sans' for Open Sans)." }
                    },
                    {
                      name: 'weights',
                      label: 'Teže pisave',
                      type: 'array',
                      minRows: 1,
                      fields: [{ name: 'weight', type: 'text', required: true, admin: { description: "e.g., '400', '700', 'variable' if it's a variable font."} }],
                      defaultValue: [{ weight: '700' }],
                    },
                    {
                        name: 'subsets',
                        label: 'Podmnožice (neobvezno)',
                        type: 'array',
                        fields: [{ name: 'subset', type: 'text', required: true, admin: { description: "e.g., 'latin', 'latin-ext'. Defaults to 'latin'."}}],
                        defaultValue: [{ subset: 'latin' }]
                    }
                  ]
                },
                {
                  name: 'bodyFont',
                  type: 'group',
                  label: 'Pisava besedila',
                  fields: [
                    {
                      name: 'name',
                      label: 'Ime pisave',
                      type: 'select',
                      required: true,
                      defaultValue: 'Inter',
                      options: [
                        { label: 'Inter', value: 'Inter' },
                        { label: 'Roboto', value: 'Roboto' },
                        { label: 'Open Sans', value: 'Open_Sans' },
                        { label: 'Lato', value: 'Lato' },
                        { label: 'Montserrat', value: 'Montserrat' },
                      ],
                      admin: { description: "Select a Google Font." }
                    },
                    {
                      name: 'weights',
                      label: 'Teže pisave',
                      type: 'array',
                      minRows: 1,
                      fields: [{ name: 'weight', type: 'text', required: true }],
                      defaultValue: [{ weight: '400' }],
                    },
                    {
                        name: 'subsets',
                        label: 'Podmnožice (neobvezno)',
                        type: 'array',
                        fields: [{ name: 'subset', type: 'text', required: true }],
                        defaultValue: [{ subset: 'latin' }]
                    }
                  ]
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}