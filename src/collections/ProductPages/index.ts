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
import populateFromProduct from './hooks/populateFromProduct';
import { revalidateProductPagesCache, revalidateProductPagesCacheDelete } from './hooks/revalidateProductPagesCache';


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
    singular: 'Stran izdelka',
    plural: 'Strani izdelkov',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'products', 'updatedAt'],
    group: 'Strani',
   
    livePreview: {
      url: async ({ data, req }) => {
        const slug = typeof data?.slug === 'string' ? `/izdelki/${data.slug}` : ''
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
        slug: typeof data?.slug === 'string' ? `/izdelki/${data.slug}` : '',
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
      populateFromProduct, // Populate title/slug from product after document is saved
    ],
    afterChange: [revalidateProductPagesCache],
    afterDelete: [revalidateProductPagesCacheDelete],
  },
  fields: [
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      label: 'Povezani izdelek',
      hasMany: false,
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Izberi izdelek - naslov in slug se bosta avtomatsko generirala',
      }
    },
    {
      name: 'title',
      type: 'text',
      label: 'Naslov strani izdelka',
      required: false, // Not required since it auto-populates
      localized: true,
      admin: {
        position: 'sidebar',
        readOnly:true,
        description: 'Naslov se generira samodejno iz povezanega izdelka po shranjevanju.',
      }
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Pot / Unikatni ID',
      unique: true,
      index: true,
      required: false, // Not required since it auto-populates
      admin: {
        description: 'Slug se generira samodejno iz povezanega izdelka po shranjevanju.',
        readOnly:true,
        position: 'sidebar',
      }
    },
    {
      name: "pageType",
      type: "select",
      label: "Tip strani",
      options: ["product"],
      defaultValue: "product",
      admin: {
        position: "sidebar",
        hidden: true,
      },
    },
    {
      name: 'layout',
      label: 'Postavitev strani izdelka',
      type: 'blocks',
      admin: {
        description: "Dodaj odsek na strani izdelka",
        initCollapsed: true,
      },
      minRows: 1,
      blocks: productPageBlocks,
    },
  ],
};

export default ProductPages;