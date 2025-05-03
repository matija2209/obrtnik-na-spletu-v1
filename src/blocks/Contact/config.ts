import type { Block } from 'payload';

const Contact: Block = {
  slug: 'contact',
  interfaceName: 'ContactBlock',
  labels: {
    singular: 'Contact Block',
    plural: 'Contact Blocks',
  },
  fields: [
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
        {
          label: 'Simple Layout',
          value: 'simple',
        },
        // Add more template options here
      ],
    },
    {
      name: 'title',
      type: 'text',
      label: 'Naslov',
      required: false,
      localized: true,
      defaultValue: '',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Opis',
      localized: true,
      defaultValue: '',
    },
    {
      name: 'openingHoursSchedules',
      type: 'relationship',
      relationTo: 'opening-hours',
      hasMany: true,
      label: 'Opening Hours Schedules',
   
    },
    {
      name: 'phoneNumber',
      type: 'text',
      label: 'Telefonska številka',
     
    },
    {
      name: 'address',
      type: 'text',
      label: 'Naslov',

    },
  ]
};

export default Contact; 