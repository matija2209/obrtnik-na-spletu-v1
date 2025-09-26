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

import { generatePreviewPath } from '@/utilities/generatePreviewPath';
import { slugField } from '@/fields/slug';
import { revalidateDelete, revalidateProjectPage } from './hooks/revalidateProjectPage';

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
    singular: {
      en: 'Project Page',
      sl: 'Stran projekta',
      de: 'Projekt-Seite',
    },
    plural: {
      en: 'Project Pages',
      sl: 'Strani projektov',
      de: 'Projekt-Seiten',
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    hidden: true,
    group: {
      sl: 'Strani',
      de: 'Seiten',
      en: 'Pages',
    },
    // components:{
    //   beforeList:['/components/admin/CreateProjectPageFromProject']
    // },
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
    afterChange: [revalidateProjectPage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
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
        sl: 'Naslov strani projekta',
        de: 'Titel der Projektseite',
        en: 'Project Page Title',
      },
      required: true,
      
    },
    {
      name: 'relatedProject',
      type: 'relationship',
      relationTo: 'projects',
      label: {
        sl: 'Povezan projekt',
        de: 'Verknüpfter Projekt',
        en: 'Related Project',
      },
      required: false,
      admin: {
        description: {
          sl: 'Projekt, ki je povezan s to stranjo',
          de: 'Projekt, der mit dieser Seite verknüpft ist',
          en: 'Project associated with this page',
        },
        position: 'sidebar',
      },
    },
    {
      name: 'layout',
      label: {
        sl: 'Postavitev strani projekta',
        de: 'Seitenlayout der Projektseite',
        en: 'Project Page Layout',
      },
      type: 'blocks',
      admin: {
        description: {
          sl: "Dodaj odsek na strani projekta",
          de: "Fügen Sie einen Abschnitt auf der Projektseite hinzu",
          en: "Add a section to the project page",
        },
          initCollapsed: true,
      },
      minRows: 1,
      blocks: projectPageBlocks,
    },
    {
      name:"pageType",
      type:"text",
      defaultValue:"project",
      admin:{
        readOnly:true,
        position:"sidebar",
        description: {
          sl: 'Typ strani projekta',
          de: 'Typ der Projektseite',
          en: 'Project Page Type',
        },
      }
    }
  ],
};

export default ProjectPages; 