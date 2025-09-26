import type { CollectionConfig } from 'payload'

import { updateAccess } from './access/update'
import { deleteAccess } from './access/delete'
import { isSuperAdminAccess, isSuperAdmin } from '@/access/isSuperAdminAccess'
import afterChangeHook from './hooks/afterChange'
import afterOperationHook from './hooks/afterOperation'
import afterDeleteHook from './hooks/afterDelete'
import { setActiveTenant } from './endpoints/setActiveTenant'


export const Tenants: CollectionConfig = {
  slug: 'tenants',
  access: {
    create: isSuperAdminAccess,
    delete: isSuperAdminAccess,
    read: ()=>true,
    update: updateAccess,
  },
  labels:{
    singular:{
      sl:"Spletno mesto",
      en:"Tenant",
      de:"Tenants"
    },
    plural:{
      sl:"Spletno mesta",
      en:"Tenants",
      de:"Tenants"
    }
  },
  admin: {
    useAsTitle: 'name',
    group: {
      sl:'Konfiguracija',
      en:"Configuration",
      de:"Konfiguration"
    },
    defaultColumns:["name","domain","updatedAt"],
    // components will be added to a specific field
  },
  endpoints: [setActiveTenant],
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
          label: { sl: 'Splošno', en: 'General', de: 'Allgemein' },
          fields: [
            {
              name: 'name',
              label: { sl: 'Ime', en: 'Name', de: 'Name' },
              type: 'text',
              required: true,
              access: {
                update: ({ req }) => isSuperAdmin(req.user),
              },
            },
            {
              name: 'domain',
              label: { sl: 'Domena', en: 'Domain', de: 'Domain' },
              type: 'text',
              admin: {
                description: { sl: 'Uporabljeno za upravljanje najemnikov na podlagi domene', en: 'Used for domain-based tenant handling', de: 'Wird für die domänenbasierte Mandantenverwaltung verwendet' },
              },
              access: {
                update: ({ req }) => isSuperAdmin(req.user),
              },
            },
            {
              name: 'slug',
              label: { sl: 'Pot', en: 'Slug', de: 'Slug' },
              type: 'text',
              admin: {
                description: { sl: 'Uporablja se za URL poti, npr.: /tenant-slug/page-slug', en: 'Used for URL paths, example: /tenant-slug/page-slug', de: 'Wird für URL-Pfade verwendet, z. B.: /tenant-slug/page-slug' },
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
                description: {
                  sl: 'Če je označeno, za branje prijava ni potrebna. Uporabno za javne strani.',
                  en: 'If checked, logging in is not required to read. Useful for building public pages.',
                  de: 'Wenn aktiviert, ist zum Lesen keine Anmeldung erforderlich. Nützlich für öffentliche Seiten.'
                },
                position: 'sidebar',
              },
              defaultValue: false,
              index: true,
            },
            {
              name: 'activeTenantActions',
              type: 'ui',
              admin: {
                position: 'sidebar',
                components: {
                  Field: '@/collections/Tenants/components/ActiveTenantSelector#default',
                },
              },
            },
          ],
        },
        {
          label: { sl: 'Videz', en: 'Appearance', de: 'Aussehen' },
          fields: [
            {
              name: 'colors',
              label: { sl: 'Barve teme', en: 'Theme colors', de: 'Themefarben' },
              type: 'group',
              admin: {
                description: { sl: 'Določite barvno paleto za tega najemnika.', en: 'Define the color palette for this tenant.', de: 'Definieren Sie die Farbpalette für diesen Mandanten.' },
              },
              fields: [
                {
                  name: 'primary',
                  label: { sl: 'Primarna barva', en: 'Primary color', de: 'Primärfarbe' },
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
                  label: { sl: 'Primarna barva besedila', en: 'Primary foreground color', de: 'Primäre Vordergrundfarbe' },
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
                  label: { sl: 'Sekundarna barva', en: 'Secondary color', de: 'Sekundärfarbe' },
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
                  label: { sl: 'Sekundarna barva besedila', en: 'Secondary foreground color', de: 'Sekundäre Vordergrundfarbe' },
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
                  label: { sl: 'Barva poudarka', en: 'Accent color', de: 'Akzentfarbe' },
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
                  label: { sl: 'Barva besedila poudarka', en: 'Accent foreground color', de: 'Akzent-Vordergrundfarbe' },
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
                  label: { sl: 'Barva ozadja', en: 'Background color', de: 'Hintergrundfarbe' },
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
                  label: { sl: 'Barva besedila', en: 'Foreground color', de: 'Vordergrundfarbe' },
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
              label: { sl: 'Radij okvirja', en: 'Border radius', de: 'Eckenradius' },
              type: 'text',
              defaultValue: '0.625rem',
              admin: {
                description: { sl: 'Nadzira zaobljenost elementov (npr. gumbi, kartice). Uporabite rem, px itd.', en: 'Controls the roundness of elements (e.g., buttons, cards). Use rem, px, etc.', de: 'Steuert die Rundung von Elementen (z. B. Buttons, Karten). Verwenden Sie rem, px usw.' }
              }
            },
          ],
        },
        {
          label: { sl: 'Tipografija', en: 'Typography', de: 'Typografie' },
          fields: [
            {
              name: 'typography',
              label: { sl: 'Tipografija', en: 'Typography', de: 'Typografie' },
              type: 'group',
              admin: {
                description: { sl: 'Določite pisave, debeline in podmnožice za tega najemnika. Uporabljeno z next/font/google.', en: 'Define fonts, weights, and subsets for this tenant. These will be used with next/font/google.', de: 'Definieren Sie Schriftarten, Strichstärken und Subsets für diesen Mandanten. Wird mit next/font/google verwendet.' },
              },
              fields: [
                {
                  name: 'headingFont',
                  type: 'group',
                  label: { sl: 'Pisava naslovov', en: 'Heading font', de: 'Schriftart für Überschriften' },
                  fields: [
                    {
                      name: 'name',
                      label: { sl: 'Ime pisave', en: 'Font name', de: 'Schriftname' },
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
                      admin: { description: { sl: "Izberite Google pisavo. Zagotovite, da se ujema z imenom uvoza 'next/font/google' (npr. 'Open_Sans' za Open Sans).", en: "Select a Google Font. Ensure it matches the 'next/font/google' import name (e.g., 'Open_Sans' for Open Sans).", de: "Wählen Sie eine Google-Schriftart. Stellen Sie sicher, dass sie dem Importnamen von 'next/font/google' entspricht (z. B. 'Open_Sans' für Open Sans)." } }
                    },
                    {
                      name: 'weights',
                      label: { sl: 'Teže pisave', en: 'Font weights', de: 'Schriftstärken' },
                      type: 'array',
                      minRows: 1,
                      fields: [{ name: 'weight', type: 'text', required: true, admin: { description: { sl: "npr. '400', '700', 'variable' če gre za variabilno pisavo.", en: "e.g., '400', '700', 'variable' if it's a variable font.", de: "z. B. '400', '700', 'variable', wenn es eine variable Schriftart ist." } } }],
                      defaultValue: [{ weight: '700' }],
                    },
                    {
                        name: 'subsets',
                        label: { sl: 'Podmnožice (neobvezno)', en: 'Subsets (optional)', de: 'Subsets (optional)' },
                        type: 'array',
                        fields: [{ name: 'subset', type: 'text', required: true, admin: { description: { sl: "npr. 'latin', 'latin-ext'. Privzeto 'latin'.", en: "e.g., 'latin', 'latin-ext'. Defaults to 'latin'.", de: "z. B. 'latin', 'latin-ext'. Standard ist 'latin'." } }}],
                        defaultValue: [{ subset: 'latin' }]
                    }
                  ]
                },
                {
                  name: 'bodyFont',
                  type: 'group',
                  label: { sl: 'Pisava besedila', en: 'Body font', de: 'Schriftart für Text' },
                  fields: [
                    {
                      name: 'name',
                      label: { sl: 'Ime pisave', en: 'Font name', de: 'Schriftname' },
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
                      admin: { description: { sl: 'Izberite Google pisavo.', en: 'Select a Google Font.', de: 'Wählen Sie eine Google-Schriftart.' } }
                    },
                    {
                      name: 'weights',
                      label: { sl: 'Teže pisave', en: 'Font weights', de: 'Schriftstärken' },
                      type: 'array',
                      minRows: 1,
                      fields: [{ name: 'weight', type: 'text', required: true }],
                      defaultValue: [{ weight: '400' }],
                    },
                    {
                        name: 'subsets',
                        label: { sl: 'Podmnožice (neobvezno)', en: 'Subsets (optional)', de: 'Subsets (optional)' },
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