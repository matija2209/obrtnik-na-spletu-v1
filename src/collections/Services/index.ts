import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import { CollectionConfig, Access } from 'payload';

import { slugField } from '@/fields/slug';
import { HeadingFeature, FixedToolbarFeature, HorizontalRuleFeature, InlineToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical';
import iconField from '@/fields/iconsField';
import priorityField from '@/fields/priorityField';
import { revalidateServicesCache, revalidateServicesCacheDelete } from './hooks/revalidateServicesCache';

// Define access control - allowing anyone to read, admin to create/update/delete
const anyone: Access = () => true;


export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: {
      en: 'Service',
      sl: 'Storitev',
      de: 'Leistung',
    },
    plural: {
      en: 'Services',
      sl: 'Storitve',
      de: 'Leistungen',
    }
  },
  admin: {
    useAsTitle: 'title',
    description: {
      sl: 'Upravljajte seznam storitev, ki jih ponujate.',
      de: 'Verwalten Sie die Liste der von Ihnen angebotenen Leistungen.',
      en: 'Manage the list of services you offer.',
    },
    group: {
      sl: 'Dejavnost',
      de: 'Projekte',
      en: 'Projects',
    },
    defaultColumns: ['title', 'slug', 'updatedAt'],
    // components:{
    //   beforeList:['/components/admin/CreateServicePageFromService']
    // }
    // components:{
    //   views:{
    //     list: {
    //       Component: "/components/admin/collections/services/services-list.tsx",
    //     }
    //   }
    // }
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
      label: {
        sl: 'Pot / Unikatni ID',
        de: 'Pfad / Eindeutige ID',
        en: 'Path / Unique ID',
      },
      unique: true,
      index: true,
      admin: {
        description: {
          sl: 'ID se generira samodejno iz naslova, lahko pa ga definirate ročno. Uporabno pri uvažanju podatkov.',
          de: 'ID wird automatisch aus dem Titel generiert, kann aber auch manuell definiert werden. Nützlich bei der Datenimport.',
          en: 'ID is generated automatically from the title, but can also be defined manually. Useful for data import.',
        },
        position: 'sidebar',
      }
    }),
    {
      name: 'title',
      type: 'text',
      label: {
        sl: 'Naslov',
        de: 'Titel',
        en: 'Title',
      },
      required: true,
      
    },
    {
      name: 'excerpt',
      type: 'text',
      label: {
        sl: 'Kratek opis',
        de: 'Kurze Beschreibung',
        en: 'Short Description',
      },
      admin: {
        description: {
          sl: 'Kratek opis storitve, ki se bo prikazal na strani storitve',
          de: 'Kurze Beschreibung der Leistung, die auf der Service-Seite angezeigt wird',
          en: 'Short description of the service, which will be displayed on the service page',
        },
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: {
        sl: 'Opis podstoritve',
        de: 'Beschreibung der Unterleistung',
        en: 'Description of the sub-service',
      },
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
        label: {
        sl: 'Cena',
        de: 'Preis',
        en: 'Price',
      },
       // Price display might differ by locale/market
      admin: {
        description: {
          sl: 'Primer: "€50", "Od €100", "€150 - €250", "Po dogovoru"',
          de: 'Beispiel: "€50", "Ab €100", "€150 - €250", "Nach Vereinbarung"',
          en: 'Example: "€50", "From €100", "€150 - €250", "Upon agreement"',
        },
      }
    },
    {
      name:"showCta",
      type:"checkbox",
      label: {
        sl: 'Prikaži CTA',
        de: 'CTA anzeigen',
        en: 'Show CTA',
      },
      defaultValue:false,
      admin:{
        description: {
          sl: 'Pokaži CTA na strani storitve',
          de: 'CTA auf der Service-Seite anzeigen',
          en: 'Show CTA on the service page',
        }
      }
    },
    {
      name:"ctaText",
      type:"text",
      label: {
        sl: 'Tekst CTA',
        de: 'CTA-Text',
        en: 'CTA Text',
      },
      defaultValue:"Preberi več",
      admin:{
        description: {
          sl: 'Tekst CTA na strani storitve',
          de: 'CTA-Text auf der Service-Seite',
          en: 'CTA text on the service page',
        },
        condition: (data, siblingData) => data.showCta === true
      }
    },
    iconField(),
    {
      name:"features",
      type:"array",
      required:false,
      label: {
        sl: 'Značilnosti',
        de: 'Eigenschaften',
        en: 'Features',
      },
      fields:[
        {
          name:"title",
          type:"text",
            label: {
            sl: 'Naslov',
            de: 'Titel',
            en: 'Title',
          },
          required:true,
        },
        {
          name:"description",
          label: {
            sl: 'Opis',
            de: 'Beschreibung',
            en: 'Description',
          },
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
      label: {
        sl: 'Povezana mnenja (Neobvezno)',
        de: 'Verlinkte Bewertungen (Optional)',
        en: 'Linked Testimonials (Optional)',
      },
      admin: {
        position:"sidebar",
        description: {
          sl: 'Prikaži mnenja strank, ki se nanašajo na to storitev.',
          de: 'Zeigt Bewertungen von Kunden an, die sich auf diese Leistung beziehen.',
          en: 'Display testimonials from customers that relate to this service.',
        },
      }
    },
    {
      name: 'subServices',
      label: {
        sl: 'Podstoritve',
        de: 'Unterleistungen',
        en: 'Sub-Services',
      },
      type: 'relationship',
      relationTo: 'sub_services',
      hasMany: true,
      admin: {
        position:"sidebar",
        description: {
          sl: 'Poveži podstoritve, ki so povezane z te storitvijo.',
          de: 'Verknüpft Unterleistungen, die mit dieser Leistung verknüpft sind.',
          en: 'Links sub-services that are related to this service.',
        },
      }
    },
    priorityField()
  ],
}; 