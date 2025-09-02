import backgroundColour from '@/fields/backgroundColour';
import textColour from '@/fields/textColour';
import isTransparent from '@/fields/isTransperant';
import { Block } from 'payload';

const RelatedProjectsBlock: Block = {
  slug: 'relatedProjects',
  interfaceName: 'RelatedProjectsBlock',
  labels: {
    singular: 'Povezani projekti odsek',
    plural: 'Povezani projekti odseki',
  },
  fields: [
    {
      name: 'kicker',
      type: 'text',
      label: 'Kicker',
      defaultValue: '',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Naslov',
      defaultValue: 'Povezani projekti',
      admin: {
        description: 'Naslov sekcije povezanih projektov',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Podnaslov',
      admin: {
        description: 'Kratek opis sekcije povezanih projektov',
      },
    },
    {
      name: 'relatedProjects',
      type: 'relationship',
      relationTo: 'projects',
      label: 'Povezani projekt',
      hasMany: true,
      required: false,
      admin: {
        description: 'Projekt, za katerega iščemo povezane projekte (z istimi storitvami)',
      },
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
      ],
    },
    backgroundColour(),textColour.titleColor(),
    textColour.subtitleColor(),
    textColour.descriptionColor(),

    
    isTransparent(),
    {
      name: 'idHref',
      type: 'text',
      label: 'ID za sidro',
      defaultValue: 'povezani-projekti',
      admin: {
        description: 'ID za navigacijo na ta odsek',
      },
    },
  ],
};

export default RelatedProjectsBlock;
