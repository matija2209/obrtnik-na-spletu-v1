

// Removed local CtaField definition

import backgroundColour from "@/fields/backgroundColour";
import iconField from "@/fields/iconsField";

import isTransparent from "@/fields/isTransperant";
import textColour from "@/fields/textColour";
import { Block } from "payload";

const AboutBlock: Block = {
  slug: 'about',
  interfaceName: 'AboutBlock',
  labels: {
    singular: {
      sl: 'O nas odsek (Splošni)',
      de: 'Über uns Abschnitt (Allgemein)',
      en: 'About Section (General)',
    },
    plural: {
      sl: 'O nas odseki (Splošni)',
      de: 'Über uns Abschnitte (Allgemein)',
      en: 'About Sections (General)',
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
        {
          label: {
            sl: 'Varianta 1',
            de: 'Variante 1',
            en: 'Variant 1',
          },
          value:"variant1"
        }
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
      required: false,
      
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
      
      required: false,
    },
    {
      name: 'description',
      type: 'richText',
      label: {
        sl: 'Opis',
        de: 'Beschreibung',
        en: 'Description',
      },
      
    },
    {
      name: 'image',
      label: {
        sl: 'Slika',
        de: 'Bild',
        en: 'Image',
      },
      type: 'upload',
      relationTo: 'media', 
      hasMany: true,
      required: false,
    },
    {
      name: 'isInverted',
      label: {
        sl: 'Obrni postavitev',
        de: 'Invertierte Positionierung',
        en: 'Inverted Positioning',
      },
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name:"idHref",
      type:"text",
      defaultValue:"o-nas"
    },
    {
      name: 'ctas',
      label: {
        sl: 'Gumbi',
        de: 'Buttons',
        en: 'Buttons',
      },
      type: 'relationship',     
      relationTo: 'ctas',       
      hasMany: true,             
      required: false,
    },
    textColour.titleColor(),
    textColour.subtitleColor(),
    textColour.descriptionColor(),
    backgroundColour(),
    isTransparent(),
    
    {
      name: 'benefits',
      type: 'array',
      required: false,
      label: {
        sl: 'Prednosti',
        de: 'Vorteile',
        en: 'Benefits',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: {
            sl: 'Naslov prednosti',
            de: 'Titel des Vorteils',
            en: 'Title of Benefit',
          },
          
          defaultValue: '',
        },
        {
          name: 'description',
          type: 'textarea',
          label: {
            sl: 'Opis prednosti',
            de: 'Beschreibung des Vorteils',
            en: 'Description of Benefit',
          },
          
          defaultValue: '',
        },
        iconField()
      ],
    },
  ],
};

export default AboutBlock; 