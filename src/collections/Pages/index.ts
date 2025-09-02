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

import { revalidatePageCache, revalidatePageCacheDelete } from './hooks/revalidateCache';
import { generatePreviewPath } from '@/utilities/generatePreviewPath';

import MachineryBlock from '@/blocks/general/Machinery/config';
import { FormBlock } from '@/blocks/general/Form';
import { HowToBlock } from '@/blocks/general/HowTo/config';
import CtaBlock from '@/blocks/general/Cta/config';
import FeaturedProductsBlock from '@/blocks/general/FeaturedProducts/config';
import TextBlock from '@/blocks/general/Text/config';
import ProjectHighlightsBlock from '@/blocks/general/ProjectHighlights/config';



// Define access control - allowing anyone to read, admin to update
const anyone: Access = () => true;

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: {
      en: 'Page',
      sl: 'Stran',
      de: 'Seite',
    },
    plural: {
      en: 'Pages',
      sl: 'Strani',
      de: 'Seiten',
    },
  },
  
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: {
      sl: 'Strani',
      de: 'Seiten',
      en: 'Pages',
    },
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
    afterChange: [ revalidatePageCache],
    beforeChange: [populatePublishedAt],
    afterDelete: [ revalidatePageCacheDelete],
  },
  fields: [
    slugField('title', {
      name: 'slug',
      label: {
        sl: 'Pot / Unikatni ID',
        de: 'Pfad / Eindeutige ID',
        en: 'Path / Unique ID',   
      },
      unique: true,
      index: true,
      admin: {
        description: {
          sl: 'ID se generira samodejno iz naslova, lahko pa ga definirate ročno. Uporabno pri uvažanju podatkov.',
          de: 'ID wird automatisch aus dem Titel generiert, kann aber auch manuell definiert werden. Nützlich bei der Importierung von Daten.',
          en: 'ID is automatically generated from the title, but can also be defined manually. Useful for importing data.',
        },
        readOnly: false,
        position: 'sidebar',
      }
    }),
    {
      name: 'title',
      type: 'text',
      label: {
        sl: 'Naslov',
        de: 'Titel',
        en: 'Title',
      },
      required: true,
      
      admin:{
        position: 'sidebar',
      }
    },
    {
      name: 'pageType',
      type: 'select',
      label: {
        sl: 'Tip strani',
        de: 'Seitentyp',
        en: 'Page Type',
      },
      required: true,
      options: [
        { label: {
          sl: 'Navadna stran',
          de: 'Landing-Seite',
          en: 'Landing Page',
        }, value: 'landing' },
        { label: {
          sl: 'Kontaktna stran',
          de: 'Kontaktseite',
          en: 'Contact Page',
        }, value: 'contact' },
        { label: {
          sl: 'Politika zasebnosti',
          de: 'Datenschutzrichtlinie',
          en: 'Privacy Policy',
        }, value: 'privacyPolicy' },
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
          label: {
            sl: 'Vsebina',
            de: 'Inhalt',
            en: 'Content',
          },
          fields: [
            {
              name: 'layout',
              label: {
                sl: 'Postavitev strani',
                de: 'Seitenlayout',
                en: 'Page Layout',
              },
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