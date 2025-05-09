import { CollectionConfig, Access, Block, CollectionSlug } from 'payload';
import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import { formatSlug } from '@/utilities/formatSlug';

// Import service-specific blocks
import ServicesHero from '../blocks/services/Hero/config';
import ServicesPresentation from '../blocks/services/Presentation/config';
import ServicesCta from '../blocks/services/Cta/config';

// Import hooks from the Pages collection (or create specific ones if needed)
import { populatePublishedAt } from './Pages/hooks/populatePublishedAt'; // Assuming hooks can be shared
import { revalidatePage, revalidateDelete } from './Pages/hooks/revalidatePage'; // Assuming hooks can be shared
import { generatePreviewPath } from '@/utilities/generatePreviewPath';

// Define access control
const anyone: Access = () => true;

// Define the blocks available for Service Pages
const servicePageBlocks: Block[] = [
  ServicesHero,
  ServicesPresentation,
  ServicesCta,
];

export const ServicePages: CollectionConfig = {
  slug: 'service-pages',
  labels: {
    singular: 'Stran storitve',
    plural: 'Strani storitev',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Struktura', // Or a new group like 'Storitve'
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'service-pages',
          req,
        })
        return path // Ensure path is a string
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'service-pages',
        req,
      }), // Ensure this returns a string
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
    afterChange: [revalidatePage], // Ensure revalidatePage hook is compatible or adapted
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete], // Ensure revalidateDelete hook is compatible or adapted
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Naslov strani storitve',
      required: true,
      localized: true,
    },
    {
      name:"pageType",
      type:"select",
      label:"Tip strani",
      options:["service"],
      defaultValue:"service",
      admin:{
        position:"sidebar",
      },
    },
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
    {
      name: 'slug',
      label: 'Pot (/storitve/...)',
      type: 'text',
      index: true,
      required: true,
      admin: {
        position: 'sidebar',
      },
     
    },
    {
      name: 'layout',
      label: 'Postavitev strani storitve',
      type: 'blocks',
      admin: {
        initCollapsed: true,
      },
      minRows: 1,
      blocks: servicePageBlocks, // Static array of blocks
    },
    {
      name: 'sub_services',
      label: 'Prikazane podstoritve', // Displayed Sub-services
      type: 'relationship',
      relationTo: 'sub_services', // Slug of the new SubServices collection
      hasMany: true,
      admin: {
        description: 'Izberite specifične podstoritve, ki jih želite prikazati na tej strani storitve.',
      },
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services', // Assuming you have a 'services' collection
      label: 'Povezana glavna storitev (iz zbirke Storitev)',
      hasMany: false,
    }
  ],
};

export default ServicePages; 