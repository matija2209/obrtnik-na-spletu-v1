import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import { CollectionConfig, Access } from 'payload';
import { slugField } from '@/fields/slug'; // Import slugField
import { FixedToolbarFeature, HeadingFeature, HorizontalRuleFeature, InlineToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical';
import iconField from '@/fields/iconsField';
import { revalidateSubServicesCache, revalidateSubServicesCacheDelete } from './hooks/revalidateSubServicesCache';

// Define access control
const anyoneRead: Access = () => true;

export const SubServices: CollectionConfig = {
  slug: 'sub_services',
  labels: {
    singular: {
      en: 'Sub Service',
      sl: 'Podstoritev',
      de: 'Unterleistung',
    },
    plural: {
      en: 'Sub Services',
      sl: 'Podstoritve',
      de: 'Unterleistungen',
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'parentService', 'updatedAt', 'publishedAt'],
    group: {
      sl: 'Dejavnost',
      de: 'Projekte',
      en: 'Projects',
    }, // Group with main Services or a relevant group
  },
  versions: {
    drafts: {
      autosave: true,
    },
    maxPerDoc: 10,
  },
  access: {
    read: anyoneRead,
    create: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  hooks: {
    afterChange: [revalidateSubServicesCache],
    afterDelete: [revalidateSubServicesCacheDelete],
  },
  fields: [
    slugField('title', { // Generates slug from title
      name: 'slug',
      label: {
        sl: 'Pot / Unikatni ID podstoritve',
        de: 'Pfad / Eindeutige ID der Unterleistung',
        en: 'Path / Unique ID of the sub-service',
      },
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: {
          sl: 'ID se generira samodejno iz naslova, lahko pa ga definirate ročno. Uporabno pri uvažanju podatkov.',
          de: 'ID wird automatisch aus dem Titel generiert, kann aber auch manuell definiert werden. Nützlich bei der Importierung von Daten.',
          en: 'ID is automatically generated from the title, but can also be defined manually. Useful when importing data.',
        },
      }
    }),
    iconField(),
    {
      name: 'title',
      type: 'text',
      label: {
        sl: 'Naslov podstoritve',
        de: 'Titel der Unterleistung',
        en: 'Sub-Service Title',
      },
      required: true,
      
    },
    
    {
      name: 'description',
      type: 'richText',
      label: {
        sl: 'Opis podstoritve',
        de: 'Beschreibung der Unterleistung',
        en: 'Sub-Service Description',
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
          ]
        },
      }),
    },  
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'price',
      type: 'text', // Using text for flexibility (e.g., "Na zahtevo", "Od X EUR")
      label: {
        sl: 'Cena',
        de: 'Preis',
        en: 'Price',
      },
      
    },
    {
      name: 'parentService',
      type: 'relationship',
      relationTo: 'services', // Slug of your main Services collection
      label: {
        sl: 'Nadrejena storitev',
        de: 'Übergeordnete Dienstleistung',
        en: 'Parent Service',
      },
      required: false,
      admin: {
        readOnly:false,
        position: 'sidebar',
      },
    }
  ],
};

export default SubServices; 