import backgroundColour from '@/fields/backgroundColour';
import textColour from '@/fields/textColour';
import isTransparent from '@/fields/isTransperant';
import type { Block } from 'payload';

const GalleryBlock: Block = {
  slug: 'gallery',
  interfaceName: 'GalleryBlock',
  labels: {
    singular: {
      sl: 'Galerija (Splošni)',
      de: 'Galerie (Allgemein)',
      en: 'Gallery (General)',
    },
    plural: {
      sl: 'Galerije (Splošni)',
      de: 'Galerien (Allgemein)',
      en: 'Galleries (General)',
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
      name: 'autoSyncMedia',
      type: 'checkbox',
      label: {
        sl: 'Samodejno dodaj nove slike iz mape',
        de: 'Neue Bilder aus der Map automatisch hinzufügen',
        en: 'Automatically add new images from the map',
      },
      defaultValue: false,
      admin: {
        description: 'Ko je omogočeno, se bodo nove naložene slike samodejno dodale v to galerijo',
      },
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
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: {
        sl: 'Slike',
        de: 'Bilder',
        en: 'Images',
      },
    },
    {
      name: 'galleryCta',
      type: 'relationship',
      relationTo: 'ctas',
      hasMany: false,
      required: false,
        label: {
        sl: 'CTA gumb galerije',
        de: 'CTA Button der Galerie',
        en: 'CTA button of gallery',
      },
    },
    backgroundColour(),textColour.titleColor(),
    textColour.subtitleColor(),
    textColour.descriptionColor(),

    
    isTransparent(),
    {
      name:"idHref",
      type:"text",
      defaultValue:"galerija"
    },
  ]
};

export default GalleryBlock; 