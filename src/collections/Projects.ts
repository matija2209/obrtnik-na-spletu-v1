import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import { CollectionConfig } from 'payload';

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
    {
      name: 'slug',
      type: 'text',
      admin: {
        description: 'URL-friendly identifier (auto-generated from title if left blank)',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            // Auto-generate slug from title if not provided
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^\\w\\s]/g, '') // Remove non-alphanumeric chars (except space)
                .replace(/\\s+/g, '-'); // Replace spaces with hyphens
            }
            // Return original value if it exists or if title is missing
            return value;
          },
        ],
      },
    },
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
      name: 'hasBeforeAfterPairs',
      type: 'checkbox',
      label: 'This project has before/after image comparisons',
      defaultValue: false,
    },
    {
      name: 'projectImages', // <-- specific name for project images!
      type: 'array',
      label: 'Project Images',
      fields: [
        {
          name: 'type',
          type: 'radio',
          options: [
            { label: 'Single Image', value: 'single' },
            { label: 'Before/After Comparison', value: 'comparison' },
          ],
          defaultValue: 'single',
          required: true,
          admin: {
            layout: 'horizontal',
          },
        },
        // Fields for Single Images
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media', // <-- Pull from your Media Collection
          required: true,
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'single',
          },
        },
        {
          name: 'imageAltText',
          type: 'text',
          label: 'Image Alt Text',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'single',
          },
        },
        {
          name: 'imageDescription',
          type: 'richText',
          label: 'Image Description',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'single',
          },
        },
        // Fields for Before/After Comparisons
        {
          name: 'comparisonDescription',
          type: 'richText',
          label: 'Comparison Description',
          admin: {
            description: 'Explain what changes are shown in this before/after comparison',
            condition: (_, siblingData) => siblingData?.type === 'comparison',
          },
        },
        {
          name: 'beforeImage',
          type: 'group',
          label: 'Before Image',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'comparison',
          },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'altText',
              type: 'text',
              label: 'Before Image Alt Text',
            },
          ],
        },
        {
          name: 'afterImage',
          type: 'group',
          label: 'After Image',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'comparison',
          },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'altText',
              type: 'text',
              label: 'After Image Alt Text',
            },
          ],
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
  ],
  timestamps: true, // Adds createdAt and updatedAt fields automatically
};