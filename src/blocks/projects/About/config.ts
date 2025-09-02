import backgroundColour from '@/fields/backgroundColour';
import textColour from '@/fields/textColour';
import isTransparent from '@/fields/isTransperant';
import { Block } from 'payload';

const AboutProjectBlock: Block = {
  slug: 'aboutProject',
  interfaceName: 'AboutProjectBlock',
  labels: {
    singular: {
      sl: 'O projektu odsek',
      de: 'Projekt Abschnitt',
      en: 'Project Section',
    },
    plural: {
      sl: 'O projektu odseki',
      de: 'Projekt Abschnitte',
      en: 'Project Sections',
    },
  },
  fields: [
    {
      name: 'template',
      label: {
        sl: 'Predloga',
        de: 'Vorlage',
        en: 'Template',
      },
      type: 'select',
      required: true,
      defaultValue: 'default',
      options: [
        {
          label: {
            sl: 'Privzeti način',
            de: 'Standard-Layout',
            en: 'Default Layout',
          },
          value: 'default',
        },    
      ],
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      label: {
        sl: 'Izberi projekt',
        de: 'Projekt auswählen',
        en: 'Select project',
      },
      required: true,
      admin: {
        description: 'Izberi projekt, katerega podatke želiš prikazati',
      },
    },
    backgroundColour(),textColour.titleColor(),
    textColour.subtitleColor(),
    textColour.descriptionColor(),

    
    isTransparent(),
    {
      name: 'idHref',
      type: 'text',
      label: {sl:'ID za sidro', de:'ID für Anker', en:'Anchor ID'},
      defaultValue: 'o-projektu',
      admin: {
        description: 'ID za navigacijo na ta odsek',
      },
    }
  ],
};

export default AboutProjectBlock;
