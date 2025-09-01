import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import { CollectionConfig, Access } from 'payload';

import { slugField } from '@/fields/slug';
import { HeadingFeature, FixedToolbarFeature, HorizontalRuleFeature, InlineToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical';
import iconField from '@/fields/iconsField';
import { revalidateServicesCache, revalidateServicesCacheDelete } from './hooks/revalidateServicesCache';

// Define access control - allowing anyone to read, admin to create/update/delete
const anyone: Access = () => true;


export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: 'Storitev',
    plural: 'Storitve',
  },
  admin: {
    useAsTitle: 'title',
    description: 'Upravljajte seznam storitev, ki jih ponujate.',
    group: 'Dejavnost',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: {
    read: anyone,
    create: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  hooks: {
    afterChange: [revalidateServicesCache],
    afterDelete: [revalidateServicesCacheDelete],
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
      name: 'excerpt',
      type: 'text',
      label: 'Kratek opis',
      admin: {
        description: 'Kratek opis storitve, ki se bo prikazal na strani storitve',
      },
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
      name: 'priceDisplay',
      type: 'text',
      label: 'Cena',
      localized: true, // Price display might differ by locale/market
      admin: {
        description: 'Primer: "€50", "Od €100", "€150 - €250", "Po dogovoru"',
      }
    },
    {
      name:"showCta",
      type:"checkbox",
      label:"Prikaži CTA",
      defaultValue:false,
      admin:{
        description:"Pokaži CTA na strani storitve"
      }
    },
    {
      name:"ctaText",
      type:"text",
      label:"Tekst CTA",
      defaultValue:"Preberi več",
      admin:{
        description:"Tekst CTA na strani storitve",
        condition: (data, siblingData) => data.showCta === true
      }
    },
    iconField(),
    {
      name:"features",
      type:"array",
      required:false,
      label:"Značilnosti",
      fields:[
        {
          name:"title",
          type:"text",
          label:"Naslov",
          required:true,
        },
        {
          name:"description",
          label:"Opis",
          type:"text",
          required:false,
        }
      ]
    },
    {
      name: 'relatedTestimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      label: 'Povezana mnenja (Neobvezno)',
      admin: {
        position:"sidebar",
        description: 'Prikaži mnenja strank, ki se nanašajo na to storitev.',
      }
    },
    {
      name: 'subServices',
      label: 'Podstoritve',
      type: 'relationship',
      relationTo: 'sub_services',
      hasMany: true,
      admin: {
        position:"sidebar",
        description: 'Poveži podstoritve, ki so povezane z te storitvijo.',
      }
    }
  ],
}; 