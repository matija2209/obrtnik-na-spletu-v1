import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import { CollectionConfig, Access } from 'payload';
import { slugField } from '@/fields/slug';
import { HeadingFeature, FixedToolbarFeature, HorizontalRuleFeature, InlineToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical';

// Define access control - allowing anyone to read, admin to create/update/delete
const anyone: Access = () => true;

export const Collections: CollectionConfig = {
  slug: 'collections',
  labels: {
    singular: {
      sl:'Kolekcija',
      en:"Collections",
      de:"Kategorie"
    },
    plural: {
      sl:"Kolekcija",
      en:"Collections",
      de:"Katogorien"
    },
  },
  admin: {
    useAsTitle: 'title',
    description: 'Upravljajte kolekcije izdelkov.',
    group:{
      en:"Sales",
      sl:"Prodaja",
      de:"Verkauf"
    },
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: {
    read: anyone,
    create: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  fields: [
    slugField('title', {
      label: 'Pot / Unikatni ID',
      unique: true,
      index: true,
      admin: {
        description: 'ID se generira samodejno iz naslova, lahko pa ga definirate ročno. Uporabno pri uvažanju podatkov.',
        position: 'sidebar',
      }
    }),
    {
      name: 'title',
      type: 'text',
      label: 'Naslov',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Opis kolekcije',
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Slika kolekcije',
      admin: {
        description: 'Glavna slika, ki predstavlja kolekcijo',
      }
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Aktivna',
      defaultValue: true,
      admin: {
        description: 'Ali je kolekcija aktivna in vidna na spletni strani',
        position: 'sidebar',
      }
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Vrstni red',
      admin: {
        description: 'Vrstni red prikaza kolekcij (manjša številka = višje)',
        position: 'sidebar',
      }
    }
  ],
};