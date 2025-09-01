import backgroundColour from '@/fields/backgroundColour';
import colourSchema from '@/fields/colourSchema';
import isTransparent from '@/fields/isTransperant';
import type { Block } from 'payload';

const ContactBlock: Block = {
  slug: 'contact',
  interfaceName: 'ContactBlock',
  labels: {
    singular: 'Kontaktni odsek (Splošni)',
    plural: 'Kontaktni odseki (Splošni)',
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
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      hasMany: false,
      label: 'Form',
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
    backgroundColour(),
    colourSchema(),
    isTransparent(),
    {
      name:"idHref",
      type:"text",
      defaultValue:"kontakt"
    },
  ]
};

export default ContactBlock; 