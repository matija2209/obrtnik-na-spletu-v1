import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import { CollectionConfig } from 'payload';
import { slugField } from '@/fields/slug';

export const Projects: CollectionConfig = {
  slug: 'projects',
  access: {
    read: () => true,
    create: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'projectStatus', 'location', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField(),
    {
      name: 'description',
      type: 'richText',
      admin: {
        description: 'Detailed description of the project',
      },
    },
    {
      name: 'projectStatus',
      type: 'select',
      options: [
        { label: 'Planned', value: 'planned' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Completed', value: 'completed' },
      ],
      defaultValue: 'completed',
      required: true,
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'metadata',
      type: 'group',
      label: 'Project Metadata',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          label: 'Start Date',
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
            },
          },
        },
        {
          name: 'completionDate',
          type: 'date',
          label: 'Completion Date',
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
          label: 'Client Name',
        },
        {
          name: 'budget',
          type: 'text',
          label: 'Project Budget',
          admin: {
            description: 'Optional budget information',
          },
        },
      ],
    },
    {
      name: 'projectImages',
      type: 'array',
      label: 'Project Images / Pairs',
      minRows: 1,
      fields: [
        {
          name: 'image1',
          label: 'Image 1 (or Before Image)',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'altText1',
          type: 'text',
          label: 'Image 1 Alt Text',
        },
        {
          name: 'image2',
          label: 'Image 2 (or After Image) (Optional)',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
        {
          name: 'altText2',
          type: 'text',
          label: 'Image 2 Alt Text',
          admin: {
            condition: (_, siblingData) => !!siblingData.image2,
          },
        },
        {
          name: 'pairDescription',
          type: 'richText',
          label: 'Image/Pair Description (Optional)',
          admin: {
            description: 'Describe this image or the before/after comparison.',
          }
        },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Project Tags',
      labels: {
        singular: 'Tag',
        plural: 'Tags',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
      admin: {
        description: 'Add relevant tags to categorize this project',
      },
    },
    {
      name: 'servicesPerformed',
      label: 'Services Performed (Optional)',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: {
        description: 'Select the services that were part of this project.',
      },
    },
    {
      name: 'relatedTestimonials',
      label: 'Related Testimonials (Optional)',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      admin: {
        description: 'Link any testimonials specifically related to this project.',
      },
    },
    {
      name: 'dedicatedPage',
      label: 'Dedicated Case Study Page (Optional)',
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