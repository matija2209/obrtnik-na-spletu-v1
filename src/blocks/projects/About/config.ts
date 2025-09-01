import backgroundColour from '@/fields/backgroundColour';
import colourSchema from '@/fields/colourSchema';
import isTransparent from '@/fields/isTransperant';
import { Block } from 'payload';

const AboutProjectBlock: Block = {
  slug: 'aboutProject',
  interfaceName: 'AboutProjectBlock',
  labels: {
    singular: 'O projektu odsek',
    plural: 'O projektu odseki',
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
          label: "Variant 1",
          value: "variant1",
        },        
      ],
    },
    backgroundColour(),
    colourSchema(),
    isTransparent(),
    
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      label: 'Izberi projekt',
      required: true,
      admin: {
        description: 'Izberi projekt, katerega podatke želiš prikazati',
      },
    },
    {
      name: 'showGallery',
      type: 'checkbox',
      label: 'Prikaži galerijo',
      defaultValue: true,
      admin: {
        description: 'Prikaži galerijo slik projekta',
      },
    },
    {
      name: 'showProjectDetails',
      type: 'checkbox',
      label: 'Prikaži podrobnosti projekta',
      defaultValue: true,
      admin: {
        description: 'Prikaži podrobnosti kot so naročnik, datum zaključka itd.',
      },
    },
    {
      name: 'showTabs',
      type: 'checkbox',
      label: 'Prikaži tabe z opisom',
      defaultValue: true,
      admin: {
        description: 'Prikaži tabe z opisom projekta, izzivi in značilnostmi',
      },
    },
    {
      name: 'idHref',
      type: 'text',
      label: 'ID za sidro',
      defaultValue: 'o-projektu',
      admin: {
        description: 'ID za navigacijo na ta odsek',
      },
    }
  ],
};

export default AboutProjectBlock;
