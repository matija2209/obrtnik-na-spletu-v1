import backgroundColour from '@/fields/backgroundColour';
import colourSchema from '@/fields/colourSchema';
import iconField from '@/fields/iconsField';
import isTransparent from '@/fields/isTransperant';
import type { Block } from 'payload';

const ServiceBlock: Block = {
  slug: 'services',
  interfaceName: 'ServicesBlock',
  labels: {
    singular: 'Storitve odsek (Splošni)',
    plural: 'Storitve odseki (Splošni)',
  },
  fields: [
    {
      name: 'template',
      label: 'Template',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Variant 1',
          value: 'variant-1',
        },
        {
          label: 'Variant 2',
          value: 'variant-2',
        },
        {
          label: 'Variant 3',
          value: 'variant-3',
        },
        {
          label: 'Variant 4',
          value: 'variant-4',
        },
        {
          label: 'Variant 5',
          value: 'variant-5',
        },
        {
          label: 'Variant 6',
          value: 'variant-6',
        },
        {
          label: 'Variant 7',
          value: 'variant-7',
        },
        {
          label: 'Variant 8',
          value: 'variant-8',
        },
        {
          label: 'Variant 9',
          value: 'variant-9',
        },
      ],
      defaultValue: 'default',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Section Description',
    },
    backgroundColour(),
    colourSchema(),
    isTransparent(),
    {
      name: 'selectedServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: 'Select Services',
      admin: {
        description: 'Select the services to display in this section.',
      },
    },
    {
      name:"idHref",
      type:"text",
      defaultValue:"storitve"
    },
   
  ],
}; 

export default ServiceBlock;