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
      admin: {
        condition: (data: any, siblingData: any) => !siblingData?.hideSection,
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Opis',
      localized: true,
      admin: {
        condition: (data: any, siblingData: any) => !siblingData?.hideSection,
      },
    },
    {
      name: 'openingHoursSchedules',
      type: 'relationship',
      relationTo: 'opening-hours',
      hasMany: true,
      label: 'Opening Hours Schedules',
      admin: {
        description: 'Select one or more opening hours schedules to display.',
        condition: (data: any, siblingData: any) => !siblingData?.hideSection,
      },
    },
    {
      name: 'phoneNumber',
      type: 'text',
      label: 'Telefonska številka',
      admin: {
        condition: (data: any, siblingData: any) => !siblingData?.hideSection,
      },
    },
    {
      name: 'address',
      type: 'text',
      label: 'Naslov',
      admin: {
        condition: (data: any, siblingData: any) => !siblingData?.hideSection,
      },
    },
  ]
};

export default Contact; 