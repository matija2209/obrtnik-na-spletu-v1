import backgroundColour from '@/fields/backgroundColour';
import colourSchema from '@/fields/colourSchema';
import isTransparent from '@/fields/isTransperant';
import type { Block } from 'payload';


const ServiceAreaBlock: Block = {
  slug: 'serviceArea',
  interfaceName: 'ServiceAreaBlock',
  labels: {
    singular: 'Območje delovanja odsek (Splošni)',
    plural: 'Območja delovanja odseki (Splošni)',
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
    backgroundColour(),
    colourSchema(),
    isTransparent(),
    
    {
      name:"idHref",
      type:"text",
      defaultValue:"obmocje-delovanja"
    },
  ]
};

export default ServiceAreaBlock; 