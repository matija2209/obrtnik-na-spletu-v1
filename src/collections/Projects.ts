import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import { CollectionConfig } from 'payload';
import { slugField } from '@/fields/slug';

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
    group: 'Vsebina',
    defaultColumns: ['title', 'projectStatus', 'location', 'updatedAt'],
    components:{
      views:{
        list: {
          Component: "/components/admin/collections/projects/projects-list.tsx",
        }
      }
    }
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Naslov',
      required: true,
    },
    slugField(),
    {
      name: 'description',
      type: 'richText',
      label: 'Opis',
      admin: {
        description: 'Detailed description of the project',
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
          }
        },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Oznake projekta',
      labels: {
        singular: 'Tag',
        plural: 'Tags',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          label: 'Oznaka',
        },
      ],
      admin: {
        description: 'Add relevant tags to categorize this project',
      },
    },
    {
      name: 'servicesPerformed',
      label: 'Izvedene storitve (Izbirno)',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: {
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
        description: 'Link any testimonials specifically related to this project.',
      },
    },
    {
      name: 'dedicatedPage',
      label: 'Namenska stran študije primera (Izbirno)',
      type: 'relationship',
      relationTo: 'pages',
      hasMany: false,
      admin: {
        description: 'Link to a detailed page about this project, if one exists.',
      },
    },
  ],
  timestamps: true,
};