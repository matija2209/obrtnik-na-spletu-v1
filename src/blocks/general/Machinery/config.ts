import backgroundColour from '@/fields/backgroundColour';
import colourSchema from '@/fields/colourSchema';
import isTransparent from '@/fields/isTransperant';
import type { Block } from 'payload';

const MachineryBlock: Block = {
  slug: 'machinery',
  interfaceName: 'MachineryBlock',
  labels: {
    singular: 'Strojni park odsek (Splošni)',
    plural: 'Strojni parki odseki (Splošni)',
  },
  fields: [
   
    {
      name: 'title',
      type: 'text',
      label: 'Naslov sekcije strojnega parka',
      required: false,
      localized: true,
      defaultValue: 'Naš Vozni Park',
    
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Opis sekcije strojnega parka (neobvezno)',
      localized: true,
      defaultValue: 'Ponudba gradbene mehanizacije za najem',
      
    },
    {
      name: 'selectedMachinery',
      type: 'relationship',
      relationTo: 'machinery',
      hasMany: true,
      label: 'Izbrani stroji za prikaz',
      required: false,
 
    },
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
    backgroundColour(),
    colourSchema(),
    isTransparent(),
    {
      name: 'callToAction',
      label: 'Call to Action (Neobvezno)',
      type: 'relationship',
      relationTo: 'ctas',
      hasMany: false,
      required: false,
      admin: {
        description: 'Dodajte gumb \'call to action\' pod seznam strojev.'
      }
    },
    {
      name:"idHref",
      type:"text",
      defaultValue:"strojni-park"
    },
  ]
};

export default MachineryBlock; 