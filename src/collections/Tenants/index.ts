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
  labels:{
    singular:"Spletno mesto",
    plural:"Spletna mesta"
  },
  admin: {
    useAsTitle: 'name',
    group: 'Struktura',
    defaultColumns:["name","domain","updatedAt"]
  },
  hooks: {
    afterChange: [afterChangeHook],
  },
  fields: [
    {
      name: 'name',
      label: 'Ime',
      type: 'text',
      required: true,
    },
    {
      name: 'domain',
      label: 'Domena',
      type: 'text',
      admin: {
        description: 'Used for domain-based tenant handling',
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
    },
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
          // https://payloadcms.com/docs/fields/overview#admin-options
          // https://payloadcms.com/docs/fields/overview#custom-components
          admin:{
            components:{
              // TextFieldServerComponent
              // https://payloadcms.com/docs/fields/text#custom-components
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
              // TextFieldServerComponent
              // https://payloadcms.com/docs/fields/text#custom-components
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
              // TextFieldServerComponent
              // https://payloadcms.com/docs/fields/text#custom-components
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
              // TextFieldServerComponent
              // https://payloadcms.com/docs/fields/text#custom-components
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
              // TextFieldServerComponent
              // https://payloadcms.com/docs/fields/text#custom-components
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
              // TextFieldServerComponent
              // https://payloadcms.com/docs/fields/text#custom-components
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
              // TextFieldServerComponent
              // https://payloadcms.com/docs/fields/text#custom-components
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
              // TextFieldServerComponent
              // https://payloadcms.com/docs/fields/text#custom-components
              Field: '/collections/Tenants/fields/tenant-fields',
            }
          }
        },
      ],
    },
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
              name: 'name', // e.g., "Roboto", "Open_Sans"
              label: 'Ime pisave',
              type: 'select',
              required: true,
              defaultValue: 'Inter',
              options: [ // Predefined list of supported Google Fonts
                { label: 'Inter', value: 'Inter' },
                { label: 'Roboto', value: 'Roboto' },
                { label: 'Open Sans', value: 'Open_Sans' },
                { label: 'Lato', value: 'Lato' },
                { label: 'Montserrat', value: 'Montserrat' },
                // Add other Google Fonts you want to support
              ],
              admin: { description: "Select a Google Font. Ensure it matches the 'next/font/google' import name (e.g., 'Open_Sans' for Open Sans)." }
            },
            {
              name: 'weights', // e.g., ["400", "700"]
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
              options: [ // Keep consistent with displayFont options
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
    {
      name: 'radius',
      label: 'Radij okvirja',
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