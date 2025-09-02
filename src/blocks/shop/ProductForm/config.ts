
import backgroundColour from '@/fields/backgroundColour';

import isTransparent from '@/fields/isTransperant';
import textColour from '@/fields/textColour';
import type { Block } from 'payload';


const ProductFormBlock: Block = {
  slug: 'product_form',
  interfaceName: 'ProductFormBlock',
  labels: {
    singular: 'Obrazec za izdelek',
    plural: 'Obrazci za izdelke',
  },
  fields: [
    {

      name: 'product',
      label: 'Izbrani izdelek',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      admin: {
        description: 'Izberite izdelek, ki se bo prikazal v tem bloku',
      },
    },
    
    // Template Selection
    {
      name: 'template',
      label: 'Predloga',
      type: 'select',
      required: true,
      defaultValue: 'default',
      options: [
        {
          label: 'Privzeti',
          value: 'default',
        },
      ],
      admin: {
        description: 'Izberite način prikaza izdelka',
      },
    },
    
    textColour.titleColor(),
    textColour.subtitleColor(),
    textColour.descriptionColor(),
    backgroundColour(),
    isTransparent(),
    
    // Display Controls
    {
      type: 'collapsible',
      label: 'Nastavitve prikaza',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'showTitle',
              label: 'Prikaži naziv',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                width: '33%',
              },
            },
            {
              name: 'showSku',
              label: 'Prikaži SKU kodo',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                width: '33%',
              },
            },
            {
              name: 'showManufacturer',
              label: 'Prikaži proizvajalca',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                width: '34%',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'showType',
              label: 'Prikaži model',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                width: '33%',
              },
            },
            {
              name: 'showShortDescription',
              label: 'Prikaži kratek opis',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                width: '33%',
              },
            },
            {
              name: 'showLongDescription',
              label: 'Prikaži podroben opis',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                width: '34%',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'showPricing',
              label: 'Prikaži cene',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                width: '33%',
                description: 'Prikaži orientacijske cene izdelka',
              },
            },
            {
              name: 'showAvailability',
              label: 'Prikaži dostopnost',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                width: '33%',
                description: 'Prikaži status zaloge (Na voljo)',
              },
            },
            {
              name: 'showMountingInfo',
              label: 'Prikaži info o montaži',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                width: '34%',
                description: 'Prikaži ali je montaža vključena',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'showTechnicalSpecs',
              label: 'Prikaži specifikacije',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                width: '33%',
                description: 'Prikaži tehnične specifikacije',
              },
            },
            {
              name: 'showHighlights',
              label: 'Prikaži ključne lastnosti',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                width: '33%',
                description: 'Prikaži ključne lastnosti izdelka',
              },
            },
            {
              name: 'showMainImage',
              label: 'Prikaži glavno sliko',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                width: '34%',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'showGallery',
              label: 'Prikaži galerijo',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                width: '33%',
                description: 'Prikaži galerijo dodatnih slik',
              },
            },
            {
              name: 'showReviews',
              label: 'Prikaži ocene',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                width: '33%',
                description: 'Prikaži povprečne ocene in število ocen',
              },
            },
            {
              name: 'showRating',
              label: 'Prikaži oceno',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                width: '34%',
                description: 'Prikaži povprečno oceno kot zvezde',
              },
            },
          ],
        },
      ],
    },
    
    // Call-to-Action Settings
    {
      type: 'collapsible',
      label: 'Nastavitve akcijskih gumbov',
      fields: [
        {
          name: 'showOrderForm',
          label: 'Prikaži obrazec za naročilo',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Prikaži obrazec za naročilo',
          },
        },
        {
          name: 'ctaText',
          label: 'Besedilo glavnega gumba',
          type: 'text',
          defaultValue: 'Pošljite povpraševanje',
          admin: {
            condition: (_, siblingData) => siblingData.showOrderForm,
          },
        },
      ],
    },
    

    
    // Technical Settings
    {
      name: 'idHref',
      label: 'ID elementa',
      type: 'text',
      defaultValue: 'product-form',
      admin: {
        description: 'Unikaten ID za ta odsek (uporaben za sidra/povezave)',
      },
    },
  ],
};

export default ProductFormBlock;