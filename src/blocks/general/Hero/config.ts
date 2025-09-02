import backgroundColour from '@/fields/backgroundColour';
import textColour from '@/fields/textColour';
import isTransparent from '@/fields/isTransperant';
import type { Block } from 'payload';

const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: {
    singular: {
      sl: 'Hero odsek',
      de: 'Hero Sektion',
      en: 'Hero Section',
    },
    plural: {
      sl: 'Heroji (Splošni)',
      de: 'Hero Sektionen (Allgemein)',
      en: 'Hero Sections (General)',
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
    backgroundColour(),textColour.titleColor(),
    textColour.subtitleColor(),
    textColour.descriptionColor(),
    isTransparent(),
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
      name: 'includeFollowersBadge',
      label: {
        sl: 'Vključi Badge za sledilce',
        de: 'Follower-Badge einbeziehen',
        en: 'Include Followers Badge',
      },
      type: 'checkbox',
      defaultValue: false,
      required: false,
    },
    {
      name: 'ctas',
      type: 'relationship',
      relationTo: 'ctas',
      hasMany: true,
      required: false,
      label: {
        sl: 'CTA gumbe',
        de: 'CTA-Buttons',
        en: 'CTA Buttons',
      },
      minRows: 0,
      maxRows: 2,
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'highQualityMedia',
        label: {
        sl: 'Slika ozadja',
        de: 'Hintergrundbild',
        en: 'Background Image',
      },
      required: false,
      hasMany: true,
      minRows: 1,
    },
    {
      name: 'showFeatures',
      type: 'checkbox',
      label: {
        sl: 'Prikaži značilnosti',
        de: 'Features anzeigen',
        en: 'Show Features',
      },
      required: false,
      defaultValue: false,
      admin: {
        description: {
          sl: 'Prikaži značilnosti (če so na voljo). Relavantno za storitvene strani',
          de: 'Features anzeigen (falls verfügbar). Wichtig für Dienstleistungsseiten',
          en: 'Show features (if available). Relevant for service pages',
        },
      }
    },
    {
      name: 'features',
      type: 'array',
      required: false,
      label: {
        sl: 'Značilnosti',
        de: 'Features',
        en: 'Features',
      },
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'iconText',
          type: 'text',
          label: {
            sl: 'Ikona ali besedilo (npr. 10+, ✓)',
            de: 'Symbol oder Text (z.B. 10+, ✓)',
            en: 'Icon or Text (e.g. 10+, ✓)',
          },
        },
        {
          name: 'text',
          type: 'text',
          label: {
            sl: 'Besedilo značilnosti',
            de: 'Feature-Text',
            en: 'Feature Text',
          },
          defaultValue: '',
        }
      ]
    },
    {
      name: 'testimonials',
      type: 'relationship',
      relationTo: ['testimonials'],
      hasMany: true,
      required: false,
      label: {
        sl: 'Mnenja za prikaz',
        de: 'Zu zeigen Bewertungen',
        en: 'Testimonials to display',
      },
      maxRows: 2,
      admin: {
        description: {
          sl: 'Izberite mnenja, ki se bodo prikazala v floating elementih (maksimalno 2).',
          de: 'Wählen Sie Bewertungen, die in den Floating-Elementen angezeigt werden (maximal 2).',
          en: 'Select testimonials to display in floating elements (maximum 2).',
        },
      }
    },
    {
      name:"idHref",
      type:"text",
      defaultValue:"hero"
    },
  ]
};

export default HeroBlock; 