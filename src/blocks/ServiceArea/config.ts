import type { Block } from 'payload';


const ServiceArea: Block = {
  slug: 'serviceArea',
  interfaceName: 'ServiceAreaBlock',
  labels: {
    singular: 'Service Area Block',
    plural: 'Service Area Blocks',
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
      type: 'text',
      label: 'Opis',
      localized: true,
      defaultValue: '',
    },
    {
      name: 'showMap',
      type: 'checkbox',
      label: 'Prikaži zemljevid',
      defaultValue: true,
     
    },
    {
      name: 'locations',
      type: 'array',
      required: false,
      label: 'Lokacije',
      
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Ime lokacije',
          required: true,
        }
      ]
    },
  ]
};

export default ServiceArea; 