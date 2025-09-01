import { CollectionConfig, Access, Block, CollectionSlug } from 'payload';
import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import { formatSlug } from '@/utilities/formatSlug';

// Import service-specific blocks

import ServicesPresentation from '../../blocks/services/SubServices/config';


// Import hooks from the Pages collection (or create specific ones if needed)
import { populatePublishedAt } from '../Pages/hooks/populatePublishedAt'; // Assuming hooks can be shared

import { revalidateServicePagesCache, revalidateServicePagesCacheDelete } from './hooks/revalidateServicePagesCache';
import { generatePreviewPath } from '@/utilities/generatePreviewPath';
import { slugField } from '@/fields/slug';
import HeroBlock from '@/blocks/general/Hero/config';
import {FormBlock} from '@/blocks/general/Form/index';
import FaqBlock from '@/blocks/general/FAQ/config';
import ContactBlock from '@/blocks/general/Contact/config';

import AboutBlock from '@/blocks/general/About/config';

import GalleryBlock from '@/blocks/general/Gallery/config';
import ServiceAreaBlock from '@/blocks/general/ServiceArea/config';
import ProjectHighlightsBlock from '@/blocks/general/ProjectHighlights/config';
import MachineryBlock from '@/blocks/general/Machinery/config';
import ServicesBlock from '@/blocks/general/Services/config';
import TestimonialsBlock from '@/blocks/general/Testimonials/config';
import CtaBlock from '@/blocks/general/Cta/config';
import SubServiceBlock from '../../blocks/services/SubServices/config';

// Define access control
const anyone: Access = () => true;

// Define the blocks available for Service Pages
const servicePageBlocks: Block[] = [
  HeroBlock,
  ServicesBlock,
  FaqBlock,
  ContactBlock,
  AboutBlock,
  TestimonialsBlock,
  GalleryBlock,
  ServiceAreaBlock,
  ProjectHighlightsBlock,
  MachineryBlock,
  FormBlock,
  SubServiceBlock,
  CtaBlock
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
    group: 'Strani', // Or a new group like 'Storitve'
  
    livePreview: {
      url: async ({ data, req }) => {
        const slug = typeof data?.slug === 'string' ? `/storitve/${data.slug}` : ''
        const path = await generatePreviewPath({
          slug,
          collection: 'service-pages',
          req,
        })        
        return path // Ensure path is a string
      },
    },
    preview: (data, { req }) => {      
      return generatePreviewPath({
        slug: typeof data?.slug === 'string' ? `/storitve/${data.slug}` : '',
        collection: 'service-pages',
        req,
      }) // Ensure this returns a string
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
    afterChange: [revalidateServicePagesCache],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateServicePagesCacheDelete],
  },
  fields: [
    slugField('title', {
      label: 'Pot / Unikatni ID',
      unique: true,
      index: true,
      admin: {
        description: 'ID se generira samodejno iz naslova.',
        readOnly: false,
        position: 'sidebar',
      }
    }),
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
        hidden: true,
      },
    },
    {
      name: 'layout',
      label: 'Postavitev strani storitve',
      type: 'blocks',
      admin: {
        description:"Dodaj odsek na strani storitve",
        initCollapsed: true,
      },
      minRows: 1,
      blocks: servicePageBlocks, // Static array of blocks
    },
    
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services', // Assuming you have a 'services' collection
      label: 'Povezana glavna storitev (iz zbirke Storitev)',
      hasMany: false,
    },
    {
      name: 'sub_services',
      type: 'relationship',
      relationTo: 'sub_services',
      label: 'Povezane podstoritve (iz zbirke Podstoritve)',
      hasMany: true,
    }
  ],

};

export default ServicePages; 