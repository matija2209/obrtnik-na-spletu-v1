import backgroundColour from '@/fields/backgroundColour';
import textColour from '@/fields/textColour';
import isTransparent from '@/fields/isTransperant';
import type { Block } from 'payload';

export const HowToBlock: Block = {
  slug: 'howto',
  interfaceName: 'HowToBlock',
  labels: {
    singular: {
      sl: 'Kako odsek (Splošni)',
      de: 'Wie Abschnitt (Allgemein)',
      en: 'How To Section (General)',
    },
    plural: {
      sl: 'Kako odseki (Splošni)',
      de: 'Wie Abschnitte (Allgemein)',
      en: 'How To Sections (General)',
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
        sl: 'Naslov',
        de: 'Titel',
        en: 'Title',
      },
      defaultValue: 'Unsere einzigartige Beratung',
      required: true,
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
      name: 'steps',
      type: 'array',
      label: {
        sl: 'Koraki',
        de: 'Schritte',
        en: 'Steps',
      },
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'useIcon',
          type: 'checkbox',
          label: {
            sl: 'Ikona namesto številke',
            de: 'Symbol statt Nummer',
            en: 'Icon instead of number',
          },
          defaultValue: false,
        },
        {
          name: 'stepNumber',
          type: 'number',
          label: {
            sl: 'Korak številka',
            de: 'Schrittnummer',
            en: 'Step Number',
          },
          required: true,
          defaultValue: 1,
          admin: {
            condition: (data, siblingData) => !siblingData?.useIcon,
          },
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Icon (CSS class or icon name)',
          required: false,
          admin: {
            condition: (data, siblingData) => siblingData?.useIcon,
            description: 'Enter icon class name (e.g., "fa-home", "icon-star") or icon identifier',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Step Title',
          required: false,
        },
        {
          name: 'description',
          type: 'richText',
          label: 'Step Description',
          required: true,
        },
      ],
    },
    {
      name: 'cta',
      relationTo: 'ctas',
      hasMany: true,
      label: 'CTA',
      required: false,
      type: 'relationship',
    },
    backgroundColour(),textColour.titleColor(),
    textColour.subtitleColor(),
    textColour.descriptionColor(),

    isTransparent(),  
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
  ],
};