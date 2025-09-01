import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import { CollectionConfig } from 'payload';
import { slugField } from '@/fields/slug';
import { syncProjectHighlightsBlocks } from './hooks/syncProjectHighlightsBlocks';

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: 'Projekt',
    plural: 'Projekti',
  },
  access: {
    read: () => true,
    create: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  admin: {
    useAsTitle: 'title',
    description: 'Predstavite zaključene projekte ali reference.',
    group: 'Dejavnost',
    defaultColumns: ['title', 'projectStatus', 'location', 'updatedAt'],
    // components:{
    //   views:{
    //     list: {
    //       Component: "/components/admin/collections/projects/projects-list.tsx",
    //     }
    //   }
    // }
  },
  hooks: {
    afterChange: [syncProjectHighlightsBlocks],
  },
  fields: [
    slugField('title', {
      label: 'Pot / Unikatni ID',
      unique: true,
      index: true,
      admin: {
        description: 'ID se generira samodejno iz naslova.',
        readOnly: false,
        position: 'sidebar',
      }
    }),
    {
      name: 'title',
      type: 'text',
      label: 'Naslov',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Opis',
      admin: {
        description: 'Detailed description of the project',
      },
    },
    {
      name: 'excerpt',
      type: 'text',
      label: 'Kratek opis',
      admin: {
        description: 'Kratek opis projekta, ki se bo prikazal na strani projekta',
      },
    },
    {
      name: 'projectStatus',
      type: 'select',
      label: 'Status projekta',
      options: [
        { label: 'Načrtovano', value: 'planned' },
        { label: 'V izvajanju', value: 'in-progress' },
        { label: 'Zaključeno', value: 'completed' },
      ],
      defaultValue: 'completed',
      required: true,
    },
    {
      name: 'location',
      type: 'text',
      label: 'Lokacija',
    },
    {
      name: 'metadata',
      type: 'group',
      label: 'Metapodatki projekta',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          label: 'Datum začetka',
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
            },
          },
        },
        {
          name: 'completionDate',
          type: 'date',
          label: 'Datum zaključka',
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
            },
            condition: (data) => data?.projectStatus === 'completed',
          },
        },
        {
          name: 'client',
          type: 'text',
          label: 'Ime naročnika',
        },
        {
          name: 'budget',
          type: 'text',
          label: 'Proračun projekta',
          admin: {
            description: 'Optional budget information',
          },
        },
      ],
    },
    {
      name: 'projectImages',
      type: 'array',
      label: 'Slike projekta / Pari',
      minRows: 1,
      fields: [
        {
          name: 'image1',
          label: 'Slika 1 (ali pred posegom)',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'altText1',
          type: 'text',
          label: 'Nadomestno besedilo za sliko 1',
        },
        {
          name: 'image2',
          label: 'Slika 2 (ali po posegu) (Izbirno)',
          type: 'upload',
          relationTo: 'media',
          required: false,
          admin: {
            condition: (_, siblingData) => !!siblingData.image1,
          }
        },
        {
          name: 'altText2',
          type: 'text',
          label: 'Nadomestno besedilo za sliko 2',
          admin: {
            condition: (_, siblingData) => !!siblingData.image2,
          },
        },
        {
          name: 'pairDescription',
          type: 'richText',
          label: 'Opis slike/para (Izbirno)',
          admin: {
            description: 'Describe this image or the before/after comparison.',
            condition: (_, siblingData) => !!siblingData.image2,
          }
        },
      ],
    },
    {
      name: 'tags',
      type: 'text',
      label: 'Oznake projekta',
      hasMany: true,
      admin: {
        description: 'Add relevant tags to categorize this project',
        position: "sidebar",
      },
    },
    {
      name: 'servicesPerformed',
      label: 'Izvedene storitve (Izbirno)',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: {
        position: "sidebar",
        description: 'Select the services that were part of this project.',
      },
    },
    {
      name: 'relatedTestimonials',
      label: 'Povezane ocene (Izbirno)',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      admin: {
        position: "sidebar",
        description: 'Link any testimonials specifically related to this project.',
      },
    },
    {
      name: 'source',
      type: 'select',
      label: 'Vir',
      options: [
        {
          label: 'Manual',
          value: 'manual',
        },
        {
          label: 'Facebook',
          value: 'facebook',
        },
      ],
      defaultValue: 'manual',
      admin: {
        description: 'Vir projekta',
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'facebookPostId',
      type: 'text',
      label: 'Facebook Post ID',
      required: false,
      admin: {
        description: 'ID Facebook objave iz katere je bil projekt ustvarjen',
        readOnly: true,
        position: 'sidebar',
        condition: (data) => data.source === 'facebook',
      },
    },
  ],
  timestamps: true,
};