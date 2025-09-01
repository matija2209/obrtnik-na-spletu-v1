import { CollectionConfig, Access, Block } from 'payload';
import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';

// Import general blocks that can be reused
import HeroBlock from '../../blocks/general/Hero/config';
import GalleryBlock from '../../blocks/general/Gallery/config';
import FaqBlock from '../../blocks/general/FAQ/config';
import ContactBlock from '../../blocks/general/Contact/config';
import AboutBlock from '../../blocks/general/About/config';
import TestimonialsBlock from '../../blocks/general/Testimonials/config';
import AboutProjectBlock from '../../blocks/projects/About/config';
import RelatedProjectsBlock from '../../blocks/projects/RelatedProjects/config';
import CtaBlock from '../../blocks/general/Cta/config';

// Import hooks from the Pages collection
import { populatePublishedAt } from '../Pages/hooks/populatePublishedAt';

import { revalidateProjectPagesCache, revalidateProjectPagesCacheDelete } from './hooks/revalidateProjectPagesCache';
import { generatePreviewPath } from '@/utilities/generatePreviewPath';
import { slugField } from '@/fields/slug';

// Define access control
const anyone: Access = () => true;

// Define the blocks available for Project Pages
const projectPageBlocks: Block[] = [
  HeroBlock,
  GalleryBlock,
  FaqBlock,
  ContactBlock,
  AboutBlock,
  TestimonialsBlock,
  AboutProjectBlock,
  RelatedProjectsBlock,
  CtaBlock
];


export const ProjectPages: CollectionConfig = {
  slug: 'project-pages',
  labels: {
    singular: 'Stran projekta',
    plural: 'Strani projektov',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Strani',
    livePreview: {
      url: async ({ data, req }) => {
        const slug = typeof data?.slug === 'string' ? `/projekti/${data.slug}` : ''
        const path = await generatePreviewPath({
          slug,
          collection: 'project-pages' as any,
          req,
        })        
        return path
      },
    },
    preview: (data, { req }) => {      
      return generatePreviewPath({
        slug: typeof data?.slug === 'string' ? `/projekti/${data.slug}` : '',
        collection: 'project-pages' as any,
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
    afterChange: [ revalidateProjectPagesCache],
    beforeChange: [populatePublishedAt],
    afterDelete: [ revalidateProjectPagesCacheDelete],
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
      label: 'Naslov strani projekta',
      required: true,
      localized: true,
    },
    {
      name:"pageType",
      type:"select",
      label:"Tip strani",
      options:["project"],
      defaultValue:"project",
      admin:{
        position:"sidebar",
        hidden: true,
      },
    },
    {
      name: 'relatedProject',
      type: 'relationship',
      relationTo: 'projects',
      label: 'Povezan projekt',
      required: false,
      admin: {
        description: 'Projekt, ki je povezan s to stranjo',
        position: 'sidebar',
      },
    },
    {
      name: 'layout',
      label: 'Postavitev strani projekta',
      type: 'blocks',
      admin: {
        description:"Dodaj odsek na strani projekta",
        initCollapsed: true,
      },
      minRows: 1,
      blocks: projectPageBlocks,
    },
  ],
};

export default ProjectPages; 