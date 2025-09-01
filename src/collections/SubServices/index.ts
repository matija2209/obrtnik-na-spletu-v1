import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import { CollectionConfig, Access } from 'payload';
import { slugField } from '@/fields/slug'; // Import slugField
import { FixedToolbarFeature, HeadingFeature, HorizontalRuleFeature, InlineToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical';

// Define access control
const anyoneRead: Access = () => true;

export const SubServices: CollectionConfig = {
  slug: 'sub_services',
  labels: {
    singular: 'Podstoritev',
    plural: 'Podstoritve',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'parentService', 'updatedAt', 'publishedAt'],
    group: 'Dejavnost', // Group with main Services or a relevant group
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
    // Consider adding hooks to revalidate parent service pages if a sub-service changes.
  },
  fields: [
    slugField('title', { // Generates slug from title
      name: 'slug',
      label: 'Pot / Unikatni ID podstoritve',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'ID se generira samodejno iz naslova, lahko pa ga definirate ročno. Uporabno pri uvažanju podatkov.',
      }
    }),
    {
      name: 'title',
      type: 'text',
      label: 'Naslov podstoritve',
      required: true,
      localized: true,
    },
    
    {
      name: 'description',
      type: 'richText',
      label: 'Opis podstoritve',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            // BlocksFeature({ blocks: [Banner, Code, MediaBlock] }), // Uncomment if you have these blocks
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
      label: 'Cena',
      localized: true,
    },
    {
      name: 'parentService',
      type: 'relationship',
      relationTo: 'services', // Slug of your main Services collection
      label: 'Nadrejena storitev',
      required: false,
      admin: {
        readOnly:true,
        position: 'sidebar',
      },
    }
  ],
};

export default SubServices; 