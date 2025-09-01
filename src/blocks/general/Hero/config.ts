import backgroundColour from '@/fields/backgroundColour';
import colourSchema from '@/fields/colourSchema';
import isTransparent from '@/fields/isTransperant';
import type { Block } from 'payload';

const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: {
    singular: 'Hero odsek (Splošni)',
    plural: 'Heroji (Splošni)',
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
          label: 'Variant 1',
          value: 'variant1',
        },
        {
          label: 'Variant 2',
          value: 'variant2',
        },
        {
          label: 'Variant 3',
          value: 'variant3',
        },
        {
          label: 'Variant 4',
          value: 'variant4',
        },
        {
          label: 'Variant 5',
          value: 'variant5',
        },
        {
          label: 'Variant 6',
          value: 'variant6',
        },
        {
          label: 'Variant 7',
          value: 'variant7',
        }
      ],
    },
    backgroundColour(),
    colourSchema(),
    isTransparent(),
    {
      name: 'kicker',
      type: 'text',
      label: 'Kicker',
      required: false,
      localized: true,
      defaultValue: '',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Naslov',
      required: false,
      localized: true,
      defaultValue: '',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Podnaslov',
      localized: true,
      defaultValue: '',
    },
    {
      name: 'includeFollowersBadge',
      label: 'Include Followers Badge',
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
      label: 'CTA gumbe',
      minRows: 0,
      maxRows: 2,
 
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Slika ozadja',
      required: false,
      hasMany: true,
      minRows: 1,
    },
    {
      name: 'showFeatures',
      type: 'checkbox',
      label: 'Prikaži značilnosti',
      required: false,
      defaultValue: false,
      admin: {
        description: 'Prikaži značilnosti (če so na voljo). Relavantno za storitvene strani',
      }
    },
    {
      name: 'features',
      type: 'array',
      required: false,
      label: 'Značilnosti',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'iconText',
          type: 'text',
          label: 'Ikona ali besedilo (npr. 10+, ✓)',
        },
        {
          name: 'text',
          type: 'text',
          label: 'Besedilo značilnosti',
          required: false,
          localized: true,
          defaultValue: '',
        }
      ]
    },
    {
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      required: false,
      label: 'Mnenja za prikaz',
      maxRows: 2,
      admin: {
        description: 'Izberite mnenja, ki se bodo prikazala v floating elementih (maksimalno 2).',
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