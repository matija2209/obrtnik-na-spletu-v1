import { CollectionConfig, Access, Block } from 'payload';
import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import Hero from '../../blocks/general/Hero/config';
import Services from '../../blocks/general/Services/config';
import ProjectHighlights from '../../blocks/general/ProjectHighlights/config';
import About from '../../blocks/general/About/config';
import Testimonials from '../../blocks/general/Testimonials/config';
import Gallery from '../../blocks/general/Gallery/config';
import ServiceArea from '../../blocks/general/ServiceArea/config';
import Contact from '../../blocks/general/Contact/config';
import FAQ from '../../blocks/general/FAQ/config';
import Machinery from '../../blocks/general/Machinery/config';

import { slugField } from '@/fields/slug';
// Import hooks
import { populatePublishedAt } from './hooks/populatePublishedAt';
import { revalidatePage, revalidateDelete } from './hooks/revalidatePage';
import { generatePreviewPath } from '@/utilities/generatePreviewPath';


// Define access control - allowing anyone to read, admin to update
const anyone: Access = () => true;

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Podstran',
    plural: 'Podstrani',
  },
  
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Struktura',
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
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Naslov',
      required: true,
      localized: true,
    },
    // Add publishedAt field
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      label: 'Datum objave',
    },
    slugField(),
    {
      name: 'pageType',
      type: 'select',
      label: 'Tip strani',
      required: true,
      options: [
        { label: 'Privzeta pristajalna stran', value: 'landing' },
        { label: 'Kontaktna stran', value: 'contact' },
        { label: 'O nas', value: 'about' },
        { label: 'Politika zasebnosti', value: 'privacyPolicy' },
        // { label: 'Storitve', value: 'services' }, // Removed as services have their own collection
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
                condition: (data, siblingData) => {
                  return data.pageType === 'landing';
                },
              },
              minRows: 1,
              blocks: [
                Hero,
                Services,
                Machinery,
                FAQ,
                Contact,
                ProjectHighlights,
                About,
                Testimonials,
                Gallery,
                ServiceArea,
              ]
            },
          ],
        },
        
      ],
    },
  ],
};

export default Pages; 