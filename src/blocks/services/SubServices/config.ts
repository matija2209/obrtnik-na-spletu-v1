import backgroundColour from '@/fields/backgroundColour';
import colourSchema from '@/fields/colourSchema';
import isTransparent from '@/fields/isTransperant';
import type { Block } from 'payload';

const SubServiceBlock: Block = {
  slug: 'sub-services',
  interfaceName: 'SubServicesBlock',
  labels: {
    singular: 'Podstoritve odsek (Storitve)',
    plural: 'Podstoritve odseki (Storitve)',
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
        }
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
      name: 'selectedSubServices',
      type: 'relationship',
      relationTo: 'sub_services',
      hasMany: true,
      label: 'Select Sub Services',
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

export default SubServiceBlock;