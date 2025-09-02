import backgroundColour from '@/fields/backgroundColour';
import isTransparent from '@/fields/isTransperant';
import textColour from '@/fields/textColour';
import type { Block } from 'payload';

const ContactBlock: Block = {
  slug: 'contact',
  interfaceName: 'ContactBlock',
  labels: {
    singular: {
      sl: 'Kontaktni odsek (Splošni)',
      de: 'Kontakt Abschnitt (Allgemein)',
      en: 'Contact Section (General)',
    },
    plural: {
      sl: 'Kontaktni odseki (Splošni)',
      de: 'Kontakt Abschnitte (Allgemein)',
      en: 'Contact Sections (General)',
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
      name: 'showPhoneNumber',
      type: 'checkbox',
      label: {
        sl: 'Prikaži telefonsko številko',
        de: 'Telefonnummer anzeigen',
        en: 'Show Phone Number',
      },
      defaultValue: true,
    },
    {
      name:"showEmail",
      type:"checkbox",
      label: {
        sl: 'Prikaži email',
        de: 'Email anzeigen',
        en: 'Show Email',
      },
      defaultValue:true,
    },
    {
      name: 'showAddress',
      type: 'checkbox',
      label: {
        sl: 'Prikaži naslov',
        de: 'Adresse anzeigen',
        en: 'Show Address',
      },
      defaultValue: true,
    },
    backgroundColour(),textColour.titleColor(),
    textColour.subtitleColor(),
    textColour.descriptionColor(),

    isTransparent(),
    {
      name: 'openingHours',
      type: 'relationship',
      relationTo: 'opening-hours',
      hasMany: true,
      label: {
        sl: 'Odpirni ure',
        de: 'Öffnungszeiten',
        en: 'Opening Hours',
      },
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      hasMany: false,
      label: {
        sl: 'Obrazec',
        de: 'Formular',
        en: 'Form',
      },
    },
    {
      name:"images",
      type:"upload",
      relationTo:"media",
      hasMany:true,
      label: {
        sl: 'Slike',
        de: 'Bilder',
        en: 'Images',
      },
    },
    {
      name:"idHref",
      type:"text",
      defaultValue:"kontakt"
    },
  ]
};

export default ContactBlock; 