import { CollectionConfig, Access, Block, CollectionSlug, CollectionAfterChangeHook, CollectionBeforeChangeHook } from 'payload';
import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';

import { generatePreviewPath } from '@/utilities/generatePreviewPath';
import HeroBlock from '@/blocks/general/Hero/config';
import FaqBlock from '@/blocks/general/FAQ/config';
import AboutBlock from '@/blocks/general/About/config';
import GalleryBlock from '@/blocks/general/Gallery/config';
import TestimonialsBlock from '@/blocks/general/Testimonials/config';
import CtaBlock from '@/blocks/general/Cta/config';
import ProductFormBlock from '@/blocks/shop/ProductForm/config';

import { slugField } from '@/fields/slug';


// Define access control
const anyone: Access = () => true;

// Define the blocks available for Service Pages
const productPageBlocks: Block[] = [
  ProductFormBlock,
  HeroBlock,
  FaqBlock,
  AboutBlock,
  TestimonialsBlock,
  GalleryBlock,
  CtaBlock
];


export const ProductPages: CollectionConfig = {
  slug: 'product-pages',
  labels: {
    singular: {
      en: 'Product Page',
      sl: 'Stran izdelka',
      de: 'Produkt-Seite',
    },
    plural: {
      en: 'Product Pages',
      sl: 'Strani izdelkov',
      de: 'Produkt-Seiten',
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'products', 'updatedAt'],
    group: {
      sl: 'Strani', // Pages
      de: 'Seiten',
      en: 'Pages',
    },
    livePreview: {
      url: async ({ data, req }) => {
        const slug = typeof data?.slug === 'string' ? `/trgovina/${data.slug}` : ''
        const path = await generatePreviewPath({
          slug,
          collection: 'product-pages',
          req,
        })        
        return path
      },
    },
    preview: (data, { req }) => {      
      return generatePreviewPath({
        slug: typeof data?.slug === 'string' ? `/trgovina/${data.slug}` : '',
        collection: 'product-pages',
        req,
      })
    }
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
  access: {
    read: anyone,
    update: superAdminOrTenantAdminAccess,
    create: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  hooks: {
    beforeChange: [
    ],
  },
  fields: [
    slugField('title', {
      label: {
        sl: 'Pot / Unikatni ID',
        de: 'Pfad / Eindeutige ID',
        en: 'Path / Unique ID',
      },
      unique: true,
      index: true,
      admin: {
        description: {
          sl: 'ID se generira samodejno iz naslova.',
          de: 'ID wird automatisch aus dem Titel generiert.',
          en: 'ID is automatically generated from the title.',
        },
        readOnly: false,
        position: 'sidebar',
      }
    }),
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      label: {
        sl: 'Povezani izdelek',
        de: 'Verknüpfter Produkt',
        en: 'Related Product',
      },
      hasMany: false,
      required: true,
      admin: {
        position: 'sidebar',
        description: {
          sl: 'Izberi izdelek - naslov in slug se bosta avtomatsko generirala',
          de: 'Wählen Sie ein Produkt - Titel und Slug werden automatisch generiert',
          en: 'Select a product - title and slug will be automatically generated',
        },
      }
    },
    {
      name: 'title',
      type: 'text',
      label: {
        sl: 'Naslov strani izdelka',
        de: 'Titel der Produktseite',
        en: 'Product Page Title',
      },
      required: false, // Not required since it auto-populates
      
      admin: {
        position: 'sidebar',
        readOnly:true,
        description: {
          sl: 'Naslov se generira samodejno iz povezanega izdelka po shranjevanju.',
          de: 'Der Titel wird automatisch aus dem verknüpften Produkt generiert, nachdem das Dokument gespeichert wurde.',
          en: 'The title is automatically generated from the related product after saving.',
        },
      }
    },
    {
      name: 'layout',
        label: {
        sl: 'Postavitev strani izdelka',
        de: 'Seitenlayout der Produktseite',
        en: 'Product Page Layout',
      },
      type: 'blocks',
      admin: {
        description: {
          sl: "Dodaj odsek na strani izdelka",
          de: "Fügen Sie einen Abschnitt auf der Produktseite hinzu",
          en: "Add a section to the product page",
        },
        initCollapsed: true,
      },
      minRows: 1,
      blocks: productPageBlocks,
    },
    {
      name:"pageType",
      type:"text",
      label: {
        sl: 'Typ strani',
        de: 'Seitentyp',
        en: 'Page Type',
      },
      defaultValue:"product",
      admin:{
        readOnly:true,
        position:"sidebar",
        description: {
          sl: 'Typ strani izdelka',
          de: 'Typ der Produktseite',
          en: 'Product Page Type',
        },
      }
    }
  ],
};

export default ProductPages;