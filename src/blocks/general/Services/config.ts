import backgroundColour from '@/fields/backgroundColour';
import textColour from '@/fields/textColour';
import isTransparent from '@/fields/isTransperant';
import type { Block } from 'payload';

const ServiceBlock: Block = {
  slug: 'services',
  interfaceName: 'ServicesBlock',
  labels: {
    singular: {
      sl: 'Storitve odsek (Splošni)',
      de: 'Dienst Abschnitt (Allgemein)',
      en: 'Service Section (General)',
    },
    plural: {
      sl: 'Storitve odseki (Splošni)',
      de: 'Dienst Abschnitte (Allgemein)',
      en: 'Service Sections (General)',
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
      defaultValue: 'default',
    },
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
    backgroundColour(),textColour.titleColor(),
    textColour.subtitleColor(),
    textColour.descriptionColor(),

    
    isTransparent(),
    {
      name: 'selectedServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: {
        sl: 'Izberi storitve',
        de: 'Dienste auswählen',
        en: 'Select Services',
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

export default ServiceBlock;