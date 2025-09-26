import { CollectionConfig, Access, Block } from 'payload';
import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';

// Import hooks from the Pages collection (or create specific ones if needed)
import { populatePublishedAt } from '../Pages/hooks/populatePublishedAt'; // Assuming hooks can be shared

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
import { revalidateDelete, revalidateServicePage } from './hooks/revalidateServicePage';

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
    singular: {
      en: 'Service Page',
      sl: 'Stran storitve',
      de: 'Service-Seite',
    },
    plural: {
      en: 'Service Pages',
      sl: 'Strani storitev',
      de: 'Service-Seiten',
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: {
      sl: 'Strani',
      de: 'Seiten',
      en: 'Pages',
    }, // Or a new group like 'Storitve'
    // components:{
    //   beforeList:['/components/admin/CreateServicePageFromService']
    // },
    livePreview: {
      url: async ({ data, req }) => {
        const slug = typeof data?.slug === 'string' ? `/leistungen/${data.slug}` : ''
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
        slug: typeof data?.slug === 'string' ? `/leistungen/${data.slug}` : '',
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
    afterChange: [revalidateServicePage], // Ensure revalidatePage hook is compatible or adapted
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete], // Ensure revalidateDelete hook is compatible or adapted
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
      name: 'title',
      type: 'text',
      label: {
        sl: 'Naslov strani storitve',
        de: 'Titel der Service-Seite',
        en: 'Service Page Title',
      },
      required: true,
      
    },
    {
      name: 'layout',
      label: {
        sl: 'Postavitev strani storitve',
        de: 'Seitenlayout der Service-Seite',
        en: 'Service Page Layout',
      },
      type: 'blocks',
      admin: {
        description: {
          sl: "Dodaj odsek na strani storitve",
          de: "Fügen Sie einen Abschnitt auf der Service-Seite hinzu",
          en: "Add a section to the service page",
        },
        initCollapsed: true,
      },
      minRows: 1,
      blocks: servicePageBlocks, // Static array of blocks
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services', // Assuming you have a 'services' collection
      label: {
        sl: 'Povezana glavna storitev (iz zbirke Storitev)',
        de: 'Verknüpfte Hauptdienstleistung (aus der Dienstleistungssammlung)',
        en: 'Related Main Service (from the Services collection)',
      },
      hasMany: false,
    },
    {
      name: 'sub_services',
      type: 'relationship',
      relationTo: 'sub_services',
        label: {
        sl: 'Povezane podstoritve (iz zbirke Podstoritve)',
        de: 'Verknüpfte Unterdienstleistungen (aus der Unterdienstleistungssammlung)',
        en: 'Related Sub-Services (from the Sub-Services collection)',
      },
      hasMany: true,
    },
    {
      name:"pageType",
      type:"text",
      defaultValue:"service",
      admin:{
        readOnly:true,
        position:"sidebar"
      }
    }
  ],

};

export default ServicePages; 