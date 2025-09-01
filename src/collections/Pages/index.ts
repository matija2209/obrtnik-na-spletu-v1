import { CollectionConfig, Access, Block } from 'payload';
import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import HeroBlock from '../../blocks/general/Hero/config';
import Services from '../../blocks/general/Services/config';

import AboutBlock from '../../blocks/general/About/config';
import TestimonialsBlock from '../../blocks/general/Testimonials/config';
import GalleryBlock from '../../blocks/general/Gallery/config';
import ServiceAreaBlock from '../../blocks/general/ServiceArea/config';
import ContactBlock from '../../blocks/general/Contact/config';
import FaqBlock from '../../blocks/general/FAQ/config';


import { slugField } from '@/fields/slug';
// Import hooks
import { populatePublishedAt } from './hooks/populatePublishedAt';

import { revalidatePagesCache, revalidatePagesCacheDelete } from './hooks/revalidatePagesCache';
import { generatePreviewPath } from '@/utilities/generatePreviewPath';
import ProjectHighlightsBlock from '@/blocks/general/ProjectHighlights/config';
import MachineryBlock from '@/blocks/general/Machinery/config';
import { FormBlock } from '@/blocks/general/Form';
import { HowToBlock } from '@/blocks/general/HowTo/config';
import CtaBlock from '@/blocks/general/Cta/config';
import FeaturedProductsBlock from '@/blocks/general/FeaturedProducts/config';
import TextBlock from '@/blocks/general/Text/config';


// Define access control - allowing anyone to read, admin to update
const anyone: Access = () => true;

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Navadna stran',
    plural: 'Navadne strani',
  },
  
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Strani',
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'pages',
          req,
        })

        return path
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'pages',
        req,
      }),
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
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
  // Add hooks
  hooks: {
    afterChange: [ revalidatePagesCache],
    beforeChange: [populatePublishedAt],
    afterDelete: [ revalidatePagesCacheDelete],
  },
  fields: [
    slugField('title', {
      name: 'slug',
      label: 'Pot / Unikatni ID',
      unique: true,
      index: true,
      admin: {
        description: 'ID se generira samodejno iz naslova, lahko pa ga definirate ročno. Uporabno pri uvažanju podatkov.',
        readOnly: false,
        position: 'sidebar',
      }
    }),
    {
      name: 'title',
      type: 'text',
      label: 'Naslov',
      required: true,
      localized: true,
      admin:{
        position: 'sidebar',
      }
    },
    {
      name: 'pageType',
      type: 'select',
      label: 'Tip strani',
      required: true,
      options: [
        { label: 'Navadna stran', value: 'landing' },
        { label: 'Kontaktna stran', value: 'contact' },
        { label: 'Politika zasebnosti', value: 'privacyPolicy' },
      ],
      defaultValue: 'landing',
      admin: {
        position: 'sidebar',
      },
    },

    {
      type: 'tabs',
      tabs: [
        {
          label: 'Vsebina',
          fields: [
            {
              name: 'layout',
              label: 'Postavitev strani',
              type: 'blocks',
              admin:{
                initCollapsed: true,
              },
              minRows: 1,
              blocks: [
                HeroBlock,
                Services,
                FaqBlock,
                ContactBlock,
                AboutBlock,
                TestimonialsBlock,
                GalleryBlock,
                ServiceAreaBlock,
                ProjectHighlightsBlock,
                MachineryBlock,
                FormBlock,
                HowToBlock,
                CtaBlock,
                FeaturedProductsBlock,
                TextBlock
              ]
            },
          ],
        },
        
      ],
    },
  ],
};

export default Pages; 