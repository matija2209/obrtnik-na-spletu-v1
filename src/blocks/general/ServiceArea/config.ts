import backgroundColour from '@/fields/backgroundColour';
import textColour from '@/fields/textColour';
import isTransparent from '@/fields/isTransperant';
import type { Block } from 'payload';


const ServiceAreaBlock: Block = {
  slug: 'serviceArea',
  interfaceName: 'ServiceAreaBlock',
  labels: {
    singular: {
      sl: 'Območje delovanja odsek (Splošni)',
      de: 'Bereich der Tätigkeit Abschnitt (Allgemein)',
      en: 'Service Area Section (General)',
    },
    plural: {
      sl: 'Območja delovanja odseki (Splošni)',
      de: 'Bereich der Tätigkeit Abschnitte (Allgemein)',
      en: 'Service Area Sections (General)',
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
        // Add more template options here
      ],
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
        sl: 'Naslov',
        de: 'Titel',
        en: 'Title',
      },
      defaultValue: '',
    },
    {
      name: 'subtitle',
      type: 'text',
      label: {
        sl: 'Podnaslov',
        de: 'Untertitel',
        en: 'Subtitle',
      },
      defaultValue: '',
    },
    {
      name: 'showMap',
      type: 'checkbox',
        label: {
        sl: 'Prikaži zemljevid',
        de: 'Karte anzeigen',
        en: 'Show map',
      },
      defaultValue: true,
     
    },
    {
      name: 'locations',
      type: 'array',
      required: false,
      label: {
        sl: 'Lokacije',
        de: 'Orte',
        en: 'Locations',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
            label: {
            sl: 'Ime lokacije',
            de: 'Ortname',
            en: 'Location name',
          },
          required: true,
        }
      ]
    },
    backgroundColour(),textColour.titleColor(),
    textColour.subtitleColor(),
    textColour.descriptionColor(),

    
    isTransparent(),
    
    {
      name:"idHref",
      type:"text",
      defaultValue:"obmocje-delovanja"
    },
  ]
};

export default ServiceAreaBlock; 