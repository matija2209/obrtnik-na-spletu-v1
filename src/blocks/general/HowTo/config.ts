import backgroundColour from '@/fields/backgroundColour';
import colourSchema from '@/fields/colourSchema';
import isTransparent from '@/fields/isTransperant';
import type { Block } from 'payload';

export const HowToBlock: Block = {
  slug: 'howto',
  interfaceName: 'HowToBlock',
  labels: {
    singular: 'How To Section',
    plural: 'How To Sections',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      defaultValue: 'Unsere einzigartige Beratung',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      required: false,
    },
    {
      name: 'steps',
      type: 'array',
      label: 'Steps',
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'useIcon',
          type: 'checkbox',
          label: 'Use Icon Instead of Number',
          defaultValue: false,
        },
        {
          name: 'stepNumber',
          type: 'number',
          label: 'Step Number',
          required: true,
          defaultValue: 1,
          admin: {
            condition: (data, siblingData) => !siblingData?.useIcon,
          },
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Icon (CSS class or icon name)',
          required: false,
          admin: {
            condition: (data, siblingData) => siblingData?.useIcon,
            description: 'Enter icon class name (e.g., "fa-home", "icon-star") or icon identifier',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Step Title',
          required: false,
        },
        {
          name: 'description',
          type: 'richText',
          label: 'Step Description',
          required: true,
        },
      ],
    },
    {
      name: 'cta',
      relationTo: 'ctas',
      hasMany: true,
      label: 'CTA',
      required: false,
      type: 'relationship',
    },
    backgroundColour(),
    colourSchema(),
    isTransparent(),  
    
    {
        name: 'template',
        label: 'Template',
        type: 'select',
        required: true,
        defaultValue: 'default',
        options: [
          {
            label: 'Default Layout',
            value: 'default',
          },
        ],
      },
  ],
};