import backgroundColour from '@/fields/backgroundColour';
import textColour from '@/fields/textColour';
import isTransparent from '@/fields/isTransperant';
import type { Block } from 'payload';

const SubServiceBlock: Block = {
  slug: 'sub-services',
  interfaceName: 'SubServicesBlock',
  labels: {
    singular: {
      sl: 'Podstoritve odsek (Storitve)',
      de: 'Unterdienst Abschnitt (Dienste)',
      en: 'Sub-Service Section (Services)',
    },
    plural: {
      sl: 'Podstoritve odseki (Storitve)',
      de: 'Unterdienst Abschnitte (Dienste)',
      en: 'Sub-Service Sections (Services)',
    },
  },
  fields: [
    {
      name: 'kicker',
      type: 'text',
      label: {
        sl: 'Kicker',
        de: 'Kicker',
        en: 'Kicker',
      },
      defaultValue: '',
    },
    {
      name: 'title',
      type: 'text',
      label: {
        sl: 'Naslov sekcije',
        de: 'Titel der Sektion',
        en: 'Section Title',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: {
        sl: 'Opis sekcije',
        de: 'Beschreibung der Sektion',
        en: 'Section Description',
      },
    },
    {
      name: 'template',
      label: {
        sl: 'Predloga',
        de: 'Vorlage',
        en: 'Template',
      },
      type: 'select',
      required: true,
      options: [
        {
          label: {
            sl: 'Privzeti način',
            de: 'Standard-Layout',
            en: 'Default Layout',
          },
          value: 'default',
        }
      ],
      defaultValue: 'default',
    },
    backgroundColour(),textColour.titleColor(),
    textColour.subtitleColor(),
    textColour.descriptionColor(),

    
    isTransparent(),
    {
      name: 'subServices',
      type: 'relationship',
      relationTo: 'sub_services',
      hasMany: true,
      label: {
        sl: 'Izberi podstoritve',
        de: 'Unterdienste auswählen',
        en: 'Select Sub-Services',
      },
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