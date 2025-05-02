import { CollectionConfig, Access } from 'payload';
import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import Hero from '../../blocks/Hero/config';
import Services from '../../blocks/Services/config';
import ProjectHighlights from '../../blocks/ProjectHighlights/config';
import About from '../../blocks/About/config';
import Testimonials from '../../blocks/Testimonials/config';
import Gallery from '../../blocks/Gallery/config';
import ServiceArea from '../../blocks/ServiceArea/config';
import Contact from '../../blocks/Contact/config';
import FAQ from '../../blocks/FAQ/config';
import Machinery from '../../blocks/Machinery/config';
import { slugField } from '@/fields/slug';


import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

// Import hooks
import { populatePublishedAt } from './hooks/populatePublishedAt';
import { revalidatePage, revalidateDelete } from './hooks/revalidatePage';
import { generatePreviewPath } from '@/utils/generatePreviewPath';


// Define access control - allowing anyone to read, admin to update
const anyone: Access = () => true;

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Page',
    plural: 'Pages',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Content',
    livePreview: {
      url: ({ data, req }) => {
        return generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'pages',
          data,
          req,
        })
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'pages',
        data,
        req,
      }),
  },
  // Enable versions & drafts
  versions: {
    drafts: true,
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
      label: 'Title',
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
      label: 'Published At',
    },
    slugField(),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              label: 'Page Layout',
              type: 'blocks',
              minRows: 1,
              blocks: [
                Hero,
                Services,
                ProjectHighlights,
                About,
                Testimonials,
                Gallery,
                ServiceArea,
                Contact,
                FAQ,
                Machinery,
              ]
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
           
          ],
        },
      ],
    },
  ],
};

export default Pages; 